const express = require("express")
const axios = require("axios")
require("colors")

// Initialize express app
const app = express()

// Body Parser
app.use(express.json())

const PORT = process.env.PORT || 4005

const baseURL = "/api/v1/"

// Home
app.get(`${baseURL}`, (req, res) => {
  // TODO: Include postman documentation
  res.redirect("")
})

const events = []

// Events route
app.post("/events", async (req, res) => {
  const event = req.body

  events.push(event)

  try {
    await axios.post("http://localhost:4000/events", event)
    await axios.post("http://localhost:4001/events", event)
    await axios.post("http://localhost:4002/events", event)
    await axios.post("http://localhost:4003/events", event)

    res.send({ status: "Ok" })
  } catch (error) {
    console.error(error)
  }
})

app.get("/events", (req, res) => {
  res.send(events)
})

const server = app.listen(PORT, () => {
  console.log(
    ` Server running in ${process.env.NODE_ENV} mode listening on port ${PORT} `
      .black.bgBrightWhite
  )
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
