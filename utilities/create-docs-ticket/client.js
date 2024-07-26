const { LinearClient } = require('@linear/sdk');
require('dotenv').config();

export default client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});
