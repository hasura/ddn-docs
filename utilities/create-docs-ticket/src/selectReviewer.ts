import { Reviewer } from './types';

// Get the current hour
function getCurrentHour(): number {
  const now = new Date();
  return now.getUTCHours();
}

// Find the right JSON
function findReviewerByName(reviewers: Reviewer[], name: string): Reviewer | undefined {
  return reviewers.find(reviewer => reviewer.name === name);
}

// Whose turn is it?
export const selectReviewer = (reviewers: Reviewer[]): Reviewer => {
  const hour = getCurrentHour();

  const sean = findReviewerByName(reviewers, 'Sean');
  const rob = findReviewerByName(reviewers, 'Rob');

  if (!sean || !rob) {
    throw new Error('Reviewer not found');
  }

  return rob;
};
