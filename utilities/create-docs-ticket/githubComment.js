require("dotenv").config();
const { generateComment, determineReviewer } = require("./helpers");

// get the author of the PR's username
const getAuthor = async (prUrl) => {
  const prNumber = prUrl.split("/").pop();
  const apiUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/pulls/${prNumber}`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `token ${process.env.DOCS_GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const pr = await response.json();
  return pr.user.login;
};

const addGitHubComment = async (prUrl) => {
  const prNumber = prUrl.split("/").pop();
  const apiUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/issues/${prNumber}/comments`;
  let reviewer = determineReviewer();
  reviewer = JSON.parse(reviewer);
  const addComment = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `token ${process.env.DOCS_GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: `${generateComment(await getAuthor(prUrl), reviewer)}`,
    }),
  });
  const comment = await addComment.json();
  if (comment.id) {
    console.log("Comment added to PR");
  } else {
    console.log(`Error adding comment to PR: ${comment.message}`);
  }
  return comment;
};

module.exports = addGitHubComment;
