const express = require("express")
const { randomBytes } = require("crypto")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(cors())

const posts = {}

app.get("/posts", (req, res) => {
  res.send(posts)
})

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex")
  const { title } = req.body

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
        comments: [],
      },
    })

    posts[id] = {
      id,
      title,
      comments: [],
    }

    res.status(201).send(posts[id])
  } catch (error) {
    console.log(error)
  }
})

app.post("/events", (req, res) => {
  console.log("Received events => ", req.body.type)

  res.send({})
})

app.listen(4000, () => {
  console.log("Server listening on 4000.")
})
