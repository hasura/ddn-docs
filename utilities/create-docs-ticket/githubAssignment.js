require("dotenv").config();
const { determineReviewer } = require("./helpers");

const assignReviewer = async (prUrl) => {
  const prNumber = prUrl.split("/").pop();
  let reviewer = determineReviewer();
  reviewer = JSON.parse(reviewer);
  const apiUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/pulls/${prNumber}/requested_reviewers`;
  const assignResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `token ${process.env.DOCS_GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reviewers: [reviewer.github_username],
    }),
  });

  if (assignResponse.ok) {
    console.log(
      `${reviewer.name} has been assigned to review this PR on GitHub.`
    );
  } else {
    console.error(
      "Error assigning reviewer on GitHub:",
      assignResponse.statusText
    );
  }

  return assignResponse;
};

module.exports = assignReviewer;
