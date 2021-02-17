const express = require("express")
const { randomBytes } = require("crypto")
const axios = require("axios")

const app = express()
app.use(express.json())

const posts = {}

app.get("/posts", (req, res) => {
  res.send(posts)
})

app.post("/events", async (req, res) => {
  const { type, data } = req.body

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved"

    data.status = status
  }

  try {
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data,
    })

    res.status(201).send(posts[id])
  } catch (error) {
    console.log(error)
  }
})

app.post("/events", (req, res) => {
  console.log("Received events => ", req.body.type)

  res.send({})
})

app.listen(4003, () => {
  console.log("Listening on 4003")
})
