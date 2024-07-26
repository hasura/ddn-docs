require('dotenv').config();
import client from './linearClient';

const createTicket = async ({ title, url }) => {
  await client.createIssue({
    teamId: process.env.LINEAR_TEAM_ID,
    title: `DDN Review: ${title}`,
    description: `Link to PR: ${url}`,
    stateId: process.env.LINEAR_TODO_COLUMN_ID,
    assigneeId: process.env.LINEAR_REVIEWER_ID,
  });
};

const generateNewTicket = async prInfo => {
  return await createTicket(prInfo);
};

module.exports = generateNewTicket;
