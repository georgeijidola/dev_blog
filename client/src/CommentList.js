import React from "react"

export default ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    const { status, content } = comment

    let displayContent

    if (status === "approved") {
      displayContent = content
    } else if (status === "pending") {
      displayContent = "Comment awaiting moderation."
    } else if (status === "rejected") {
      displayContent = "This comment has been rejected."
    }

    return <li key={comment.id}>{displayContent}</li>
  })

  return <ul>{renderedComments}</ul>
}
