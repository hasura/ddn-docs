"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGitHubCommentToPr = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateGhComment = (author, reviewer) => {
    return `@${author} Thanks for your PR! I've assigned @${reviewer.name} to review it.`;
};
const getPrAuthor = async (prUrl) => {
    var _a;
    const prNumber = prUrl.split('/').pop();
    const apiUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/pulls/${prNumber}`;
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Authorization: `token ${process.env.DOCS_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    const pr = await response.json();
    return ((_a = pr.user) === null || _a === void 0 ? void 0 : _a.login) || null;
};
const addGitHubCommentToPr = async (prUrl) => {
    const prNumber = prUrl.split('/').pop();
    const apiUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/issues/${prNumber}/comments`;
    const reviewer = JSON.parse(process.env.REVIEWER);
    const author = await getPrAuthor(prUrl);
    if (!author) {
        console.error('Error getting author, skipping comment');
        return '';
    }
    const addComment = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Authorization: `token ${process.env.DOCS_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            body: `${generateGhComment(author, reviewer)}`,
        }),
    });
    const comment = await addComment.json();
    if (comment.id) {
        console.log('Comment added to PR');
    }
    else {
        console.log(`Error adding comment to PR: ${comment.message}`);
    }
    return comment;
};
exports.addGitHubCommentToPr = addGitHubCommentToPr;
