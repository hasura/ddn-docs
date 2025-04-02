import React from 'react';
import styles from './PqlChat.module.css';

interface PqlChatProps {
  children: React.ReactNode;
}

interface UserProps {
  children: React.ReactNode;
}

interface PqlProps {
  children: React.ReactNode;
}

interface QueryPlanProps {
  children: React.ReactNode;
}

const PqlIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 24" fill="none">
    <path
      d="M13.9022 10.8696C13.9022 7.52174 11.4674 6 9.18478 6H6.36957C4.01087 6 1.5 7.29348 1.5 10.6413C1.5 13.9891 4.3913 15.3587 6.67391 15.3587H10.25L13.3696 18.4783H13.9022V10.8696Z"
      stroke="#18222F"
      stroke-width="1.5"
      stroke-miterlimit="10"
    />
    <path
      d="M25.5 18.4022H20.2925C18.783 18.4022 17.5 17.1087 17.5 15.5109V6"
      stroke="#18222F"
      stroke-width="1.5"
      stroke-miterlimit="10"
    />
  </svg>
);

export const PqlChat: React.FC<PqlChatProps> = ({ children }) => {
  return <div className={styles.chatContainer}>{children}</div>;
};

export const User: React.FC<UserProps> = ({ children }) => {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.messageContent}>
        <div className={styles.userMessage}>{children}</div>
      </div>
    </div>
  );
};

export const Pql: React.FC<PqlProps> = ({ children }) => {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.avatar}>
        <PqlIcon />
      </div>
      <div className={styles.messageContent}>
        <div className={styles.pqlMessage}>{children}</div>
      </div>
    </div>
  );
};

export const QueryPlanComponent: React.FC<QueryPlanProps> = ({ children }) => {
  return (
    <div className={styles.queryPlan}>
      <div className={styles.queryPlanHeader}>
        <div className={styles.queryPlanTitle}>
          <span className={styles.queryPlanIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 3.5C14 4.33 13.33 5 12.5 5C11.67 5 11 4.33 11 3.5C11 2.67 11.67 2 12.5 2C13.33 2 14 2.67 14 3.5ZM12.5 6C11.67 6 11 6.67 11 7.5C11 8.33 11.67 9 12.5 9C13.33 9 14 8.33 14 7.5C14 6.67 13.33 6 12.5 6ZM12.5 10C11.67 10 11 10.67 11 11.5C11 12.33 11.67 13 12.5 13C13.33 13 14 12.33 14 11.5C14 10.67 13.33 10 12.5 10Z"
                fill="currentColor"
              />
              <path d="M3 4H9V5H3V4ZM3 8H9V9H3V8ZM3 12H9V13H3V12Z" fill="currentColor" />
            </svg>
          </span>
          Query Plan
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.3 2.7H2.7C2.31 2.7 2 3.01 2 3.4V12.6C2 12.99 2.31 13.3 2.7 13.3H13.3C13.69 13.3 14 12.99 14 12.6V3.4C14 3.01 13.69 2.7 13.3 2.7ZM13.3 12.6H2.7V3.4H13.3V12.6Z"
                fill="currentColor"
              />
              <path
                d="M4.1001 6.2H11.9001V6.9H4.1001V6.2ZM4.1001 7.6H11.9001V8.3H4.1001V7.6ZM4.1001 9H11.9001V9.7H4.1001V9Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button className={styles.actionButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.7 3.3C12.3 2.9 11.7 2.9 11.3 3.3L6 8.6L4.7 7.3C4.3 6.9 3.7 6.9 3.3 7.3C2.9 7.7 2.9 8.3 3.3 8.7L5.3 10.7C5.5 10.9 5.7 11 6 11C6.3 11 6.5 10.9 6.7 10.7L12.7 4.7C13.1 4.3 13.1 3.7 12.7 3.3Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button className={styles.actionButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2ZM8.7 11.3C8.5 11.5 8.3 11.6 8 11.6C7.7 11.6 7.5 11.5 7.3 11.3C6.9 10.9 6.9 10.3 7.3 9.9L8.6 8.6L7.3 7.3C6.9 6.9 6.9 6.3 7.3 5.9C7.7 5.5 8.3 5.5 8.7 5.9L10.7 7.9C11.1 8.3 11.1 8.9 10.7 9.3L8.7 11.3Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      <ol>
        {React.Children.map(children, child => {
          if (typeof child === 'string') {
            return <li>{child}</li>;
          }
          return child;
        })}
      </ol>
    </div>
  );
};
