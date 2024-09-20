import dotenv from 'dotenv';
import { linearClient } from './linearClient';
import { AttachmentPayload, IssuePayload } from '@linear/sdk';

dotenv.config();

interface PRInfo {
  prTitle: string;
  prUrl: string;
}

interface Reviewer {
  linear_id: string;
  github_username: string;
  name: string;
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

const createTicket = async ({ prTitle, prUrl }: PRInfo): Promise<IssuePayload> => {
  const reviewer: Reviewer = JSON.parse(process.env.REVIEWER!);
  const ticket = await linearClient.createIssue({
    teamId: process.env.LINEAR_TEAM_ID!,
    title: `DDN Review: ${prTitle}`,
    description: `Link to PR: ${prUrl}`,
    stateId: process.env.LINEAR_TODO_COLUMN_ID!,
    assigneeId: reviewer.linear_id,
    cycleId: await getCurrentCycle(),
  });
  return ticket;
};

const addLinkAsAttachmentToTicket = async (prUrl: string, issueId: string): Promise<AttachmentPayload> => {
  try {
    const attachment = await linearClient.createAttachment({
      issueId,
      title: 'Link to PR',
      url: prUrl,
    });
    console.log('Link added to ticket:', attachment);
    return attachment;
  } catch (error) {
    console.error('Error adding link to ticket:', error);
    throw error;
  }
};

export const generateNewTicket = async (prInfo: PRInfo): Promise<IssuePayload> => {
  return await createTicket(prInfo);
};
