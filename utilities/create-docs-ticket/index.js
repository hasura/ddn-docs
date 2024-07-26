const generateNewTicket = require('./generation.js');
const assignOnGithub = require('./githubAssignment.js');
const addCommentToPR = require('./githubComment.js');
require('dotenv').config();

const title = process.argv[2];
const url = process.argv[3];

const main = async (title, url) => {
  await generateNewTicket({ title, url });
  await assignOnGithub(url);
  const commentResponse = await addCommentToPR(url);
  return commentResponse;
};

main(title, url);
