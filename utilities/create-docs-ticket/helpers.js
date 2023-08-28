require('dotenv').config();

const determineReviewer = () => {
  const date = new Date();
  const hour = date.getUTCHours();
  let reviewer = null;

  hour < 12
    ? (reviewer = process.env.DOCS_JIRA_REVIEWER_MORNING)
    : (reviewer = process.env.DOCS_JIRA_REVIEWER_AFTERNOON);

  return reviewer;
};

const generateComment = (author, reviewer) => {
  return `Hey, @${author} :wave:\n\nThanks for this PR! Since you changed docs files, our automated Action assigned ${reviewer.name} as your reviewer :tada:\n\nBefore ${reviewer.name} looks over the changes, we ask you to take care of a couple of items:\n- [ ] Make sure you've checked over our [PR guide on the wiki](https://hasura.io/docs/wiki/checklist/). It ensures you've done your due diligence on the basics: spelling, heading casings, etc.\n- [ ] ${reviewer.name} will need a review from someone on your team to ensure your team-specific content is accurate. Once that's done, ping [${reviewer.name} on Slack](${reviewer.slack_link}), and he'll give a docs review :fire:\n- [ ] **Additionally, please check this box to confirm your feature works as expected when using the documentation you've written. This is critical to ensuring our users have the information they need.**\n\nThe docs team aims to get all PRs reviewed within 48 hours of your team doing a review in the form of a content pass. Let ${reviewer.name} know the level of urgency [on Slack](${reviewer.slack_link}) :+1:`;
};

module.exports = {
  determineReviewer,
  generateComment,
};
