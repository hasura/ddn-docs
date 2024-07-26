require('dotenv').config();
const client = require('./client');

const createTicket = async ({ title, url }) => {
  const reviewer = JSON.parse(process.env.REVIEWER);
  await client.createIssue({
    teamId: process.env.LINEAR_TEAM_ID,
    title: `DDN Review: ${title}`,
    description: `Link to PR: ${url}`,
    stateId: process.env.LINEAR_TODO_COLUMN_ID,
    assigneeId: reviewer.linear_id,
  });
};

const generateNewTicket = async prInfo => {
  return await createTicket(prInfo);
};

module.exports = generateNewTicket;
