const { LinearClient } = require('@linear/sdk');
require('dotenv').config();

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

module.exports = client;
