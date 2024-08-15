require('dotenv').config();
const client = require('./client');

const getCurrentCycle = async () => {
  try {
    const team = await client.team(process.env.LINEAR_TEAM_ID);
    const activeCycle = await team.activeCycle;
    return activeCycle.id;
  } catch (error) {
    console.error('Error fetching current cycle:', error);
    throw error;
  }
};

const createTicket = async ({ title, url }) => {
  const reviewer = JSON.parse(process.env.REVIEWER);
  await client.createIssue({
    teamId: process.env.LINEAR_TEAM_ID,
    title: `DDN Review: ${title}`,
    description: `Link to PR: ${url}`,
    stateId: process.env.LINEAR_TODO_COLUMN_ID,
    assigneeId: reviewer.linear_id,
    cycleId: await getCurrentCycle(),
    url: url,
  });
};

const generateNewTicket = async prInfo => {
  return await createTicket(prInfo);
};

module.exports = generateNewTicket;
