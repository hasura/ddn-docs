import dotenv from 'dotenv';
import { Reviewer } from './types';
import { linearClient } from './linearClient';
import { AttachmentPayload } from '@linear/sdk';

dotenv.config();

interface PRInfo {
  prTitle: string;
  prUrl: string;
  assignedReviewer: Reviewer;
}

const getCurrentCycle = async (): Promise<string> => {
  try {
    const team = await linearClient.team(process.env.LINEAR_TEAM_ID!);
    const activeCycle = await team.activeCycle;
    return activeCycle!.id;
  } catch (error) {
    console.error('Error fetching current cycle:', error);
    throw error;
  }
};

export const createLinearTicket = async ({ prTitle, prUrl, assignedReviewer }: PRInfo) => {
  return await linearClient.createIssue({
    teamId: process.env.LINEAR_TEAM_ID!,
    title: `DDN PR Review: ${prTitle}`,
    description: `Link to PR: ${prUrl}`,
    stateId: process.env.LINEAR_TODO_COLUMN_ID!,
    assigneeId: assignedReviewer.linear_id,
    cycleId: await getCurrentCycle(),
  });
};

export const addLinkAsAttachmentToTicket = async (prUrl: string, issueId: string): Promise<AttachmentPayload> => {
  try {
    const attachment = await linearClient.attachmentLinkGitHubPR(issueId, prUrl);
    console.log('Link added to ticket:', attachment);
    return attachment;
  } catch (error) {
    console.error('Error adding link to ticket:', error);
    throw error;
  }
};
