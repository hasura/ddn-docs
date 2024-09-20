"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linearClient = void 0;
const sdk_1 = require("@linear/sdk");
require('dotenv').config();
exports.linearClient = new sdk_1.LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
});
