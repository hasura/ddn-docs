"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const linearTicketGeneration_1 = require("./linearTicketGeneration");
const assignGitHubReviewer_1 = require("./assignGitHubReviewer");
const githubComment_1 = require("./githubComment");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = ['LINEAR_TEAM_ID', 'REVIEWER', 'REPO_OWNER', 'REPO_NAME', 'DOCS_GITHUB_TOKEN'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
const title = process.argv[2];
const url = process.argv[3];
if (!title || !url) {
    console.error('Usage: npx ts-node index.ts <title> <url>');
    process.exit(1);
}
const main = async (title, url) => {
    try {
        const ticket = await (0, linearTicketGeneration_1.createLinearTicket)({ prTitle: title, prUrl: url });
        const issue = await ticket.issue;
        if (issue) {
            await (0, linearTicketGeneration_1.addLinkAsAttachmentToTicket)(url, issue === null || issue === void 0 ? void 0 : issue.id);
        }
        await (0, assignGitHubReviewer_1.assignGitHubReviewer)(url);
        const commentResponse = await (0, githubComment_1.addGitHubCommentToPr)(url);
        return commentResponse;
    }
    catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
};
main(title, url);
