require('dotenv').config();

const createTicketPayload = prInfo => {
  return {
    fields: {
      summary: `v3 Review: ${prInfo.title}`,
      issuetype: {
        id: `${process.env.DOCS_JIRA_ISSUE_TYPE}`,
      },
      project: {
        key: `${process.env.DOCS_JIRA_PROJECT_KEY}`,
      },
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Link to PR: ${prInfo.url}`,
              },
            ],
          },
        ],
      },
    },
  };
};

const createTicket = async issuePayload => {
  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${process.env.DOCS_JIRA_USER_EMAIL}:${process.env.DOCS_JIRA_API_KEY}`
    ).toString('base64')}`,
    'Content-Type': 'application/json',
  };

  const newTicket = await fetch(process.env.DOCS_JIRA_API_ENDPOINT, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(issuePayload),
  });

  const data = await newTicket.json();

  return data.key;
};

const generateNewTicket = async prInfo => {
  const issuePayload = createTicketPayload(prInfo);
  return await createTicket(issuePayload);
};

module.exports = generateNewTicket;
