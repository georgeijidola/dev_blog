const express = require("express")
const { randomBytes } = require("crypto")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(cors())

const commentsByPostId = {}

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex")
  const { content } = req.body

  const comments = commentsByPostId[req.params.id] || []

  const comment = { id: commentId, content, status: "pending" }
  comments.push(comment)

  commentsByPostId[req.params.id] = comments

  try {
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: { postId: req.params.id, ...comment },
    })

    res.status(201).send(comments)
  } catch (error) {
    console.error(error)
  }
})

app.post("/events", async (req, res) => {
  console.log("Received events => ", req.body.type)

  const { type, data } = req.body

  if (type === "CommentModerated") {
    const { id, postId, status } = data

    const comment = commentsByPostId[postId].find(
      (comment) => comment.id === id
    )

    comment.status = status

    try {
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: { postId, ...comment },
      })
    } catch (error) {
      console.error(error)
    }
  }

  res.send({})
})

app.listen(4001, () => {
  console.log("Listening on 4001")
})
