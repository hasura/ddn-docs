require('dotenv').config();

const createTicketPayload = (prInfo) => {
  return {
    fields: {
      summary: `Review: ${prInfo.title}`,
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
                text: 'Link to PR: ',
              },
              {
                type: 'text',
                text: prInfo.title,
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: prInfo.url,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
};

const createTicket = async (issuePayload) => {
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

const generateNewTicket = async (prInfo) => {
  const issuePayload = createTicketPayload(prInfo);
  const newTicket = await createTicket(issuePayload);
  return newTicket;
};

module.exports = generateNewTicket;
