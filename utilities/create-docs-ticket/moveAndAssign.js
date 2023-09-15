require("dotenv").config();
const { determineReviewer } = require("./helpers");

const config = {
  currentSprintEndpoint: `${process.env.DOCS_JIRA_BASE_URL}/rest/agile/latest/board/${process.env.DOCS_JIRA_BOARD_NUMBER}/sprint?state=active`,
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${process.env.DOCS_JIRA_USER_EMAIL}:${process.env.DOCS_JIRA_API_KEY}`
    ).toString("base64")}`,
    "Content-Type": "application/json",
  },
};

const getSprint = async () => {
  const currentSprint = await fetch(config.currentSprintEndpoint, {
    method: "GET",
    headers: config.headers,
  });

  const data = await currentSprint.json();
  const currentSprintId = data.values[0].id;

  return currentSprintId;
};

const moveTicketToSprint = async (sprintId, ticketId) => {
  const sprintResponse = await fetch(
    `${process.env.DOCS_JIRA_BASE_URL}/rest/agile/1.0/sprint/${sprintId}/issue`,
    {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({ issues: [ticketId] }),
    }
  );

  if (sprintResponse.ok) {
    console.log("Issue moved to the sprint successfully.");
  } else {
    console.error(
      "Error moving issue to the sprint:",
      sprintResponse.statusText
    );
  }
};

const assignReviewer = async (ticketId) => {
  const assigneeDetails = {};
  let reviewer = determineReviewer();
  reviewer = JSON.parse(reviewer);
  const assignResponse = await fetch(
    `${process.env.DOCS_JIRA_BASE_URL}/rest/api/2/issue/${ticketId}/`,
    {
      method: "PUT",
      headers: config.headers,
      body: JSON.stringify({
        fields: {
          assignee: {
            accountId: reviewer.jira_id,
          },
        },
      }),
    }
  );

  if (assignResponse.ok) {
    assigneeDetails.reviewer = reviewer.name;
    assigneeDetails.reviewerSlack = reviewer.slack_link;
    console.log(
      `${assigneeDetails.reviewer} has been assigned to review this ticket in Jira.`
    );
  } else {
    console.error("Error assigning issue:", assignResponse.statusText);
  }

  return assigneeDetails;
};

const moveAndAssign = async (ticketId) => {
  const sprintId = await getSprint();
  const movedTicket = await moveTicketToSprint(sprintId, ticketId);
  const assignedTicket = await assignReviewer(ticketId);
  return assignedTicket;
};

module.exports = moveAndAssign;
