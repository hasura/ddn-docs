"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewTicket = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const linearClient_1 = require("./linearClient");
dotenv_1.default.config();
const getCurrentCycle = async () => {
    try {
        const team = await linearClient_1.linearClient.team(process.env.LINEAR_TEAM_ID);
        const activeCycle = await team.activeCycle;
        return activeCycle.id;
    }
    catch (error) {
        console.error('Error fetching current cycle:', error);
        throw error;
    }
};
const createTicket = async ({ prTitle, prUrl }) => {
    const reviewer = JSON.parse(process.env.REVIEWER);
    const ticket = await linearClient_1.linearClient.createIssue({
        teamId: process.env.LINEAR_TEAM_ID,
        title: `DDN Review: ${prTitle}`,
        description: `Link to PR: ${prUrl}`,
        stateId: process.env.LINEAR_TODO_COLUMN_ID,
        assigneeId: reviewer.linear_id,
        cycleId: await getCurrentCycle(),
    });
    return ticket;
};
const addLinkAsAttachmentToTicket = async (prUrl, issueId) => {
    try {
        const attachment = await linearClient_1.linearClient.createAttachment({
            issueId,
            title: 'Link to PR',
            url: prUrl,
        });
        console.log('Link added to ticket:', attachment);
        return attachment;
    }
    catch (error) {
        console.error('Error adding link to ticket:', error);
        throw error;
    }
};
const generateNewTicket = async (prInfo) => {
    return await createTicket(prInfo);
};
exports.generateNewTicket = generateNewTicket;
