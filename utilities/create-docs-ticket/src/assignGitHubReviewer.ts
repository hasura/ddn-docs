import dotenv from 'dotenv';

dotenv.config();

interface Reviewer {
  github_username: string;
  name: string;
}

export const assignGitHubReviewer = async (prUrl: string): Promise<Response> => {
  const prNumber = prUrl.split('/').pop();
  const reviewer: Reviewer = JSON.parse(process.env.REVIEWER!);
  const apiUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/pulls/${prNumber}/requested_reviewers`;
  const assignResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `token ${process.env.DOCS_GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reviewers: [reviewer.github_username],
    }),
  });

  if (assignResponse.ok) {
    console.log(`${reviewer.name} has been assigned to review this PR on GitHub.`);
  } else {
    console.error('Error assigning reviewer on GitHub:', assignResponse.statusText);
  }

  return assignResponse;
};
