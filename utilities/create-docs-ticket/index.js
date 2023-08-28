const generateNewTicket = require('./generation.js');
const moveAndAssign = require('./moveAndAssign.js');
const assignOnGithub = require('./githubAssignment.js');
const addCommentToPR = require('./githubComment.js');
require('dotenv').config();

const title = process.argv[3];
const url = process.argv[4];

const main = async (title, url) => {
  const newTicket = await generateNewTicket({ title, url });
  await moveAndAssign(newTicket);
  await assignOnGithub(url);
  const commentResponse = await addCommentToPR(url);
  return commentResponse;
};

main(title, url);
