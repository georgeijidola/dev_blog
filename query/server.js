const express = require("express")
const cors = require("cors")
const axios = require("axios")
require("colors")

// Initialize express app
const app = express()

// Body Parser
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4002

const baseURL = "/api/v1/"

// Home
app.get(`${baseURL}`, (req, res) => {
  // TODO: Include postman documentation
  res.redirect("")
})

const posts = {}

const handleEvent = ({ type, data }) => {
  if (type === "PostCreated") {
    const { id, title } = data

    posts[id] = { id, title, comments: [] }
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data

    posts[postId].comments.push({ id, content, postId, status })
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data
    const post = posts[postId]

    const comment = post.comments.find((comment) => comment.id === id)

    comment.status = status
    comment.content = content
  }
}
// Posts route
app.get("/posts", (req, res) => {
  res.send(posts)
})

// Events route
app.post("/events", async (req, res) => {
  try {
    const { type, data } = req.body

    handleEvent({ type, data })

    res.send({ status: "Ok" })
  } catch (error) {
    console.error(error)
  }
})

const server = app.listen(PORT, async () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} mode listening on port ${PORT} `
      .black.bgBrightWhite
  )

  const res = await axios.get("http://localhost:4005/events")

  for (let event of res.data) {
    const { type, data } = event

    console.log("Processing event: ", type)

    handleEvent({ type, data })
  }
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`.red)

  // Close server & exit process
  server.close(() => process.exit(1))
})

// Handle unhandled promise rejections
process.on("uncaughtException", (err, promise) => {
  console.error(`Error: ${err.message}`.red)

  // Close server & exit process
  server.close(() => process.exit(1))
})
