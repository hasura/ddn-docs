import React, { useState, useEffect } from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import styles from './styles.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';
import fetchUser from '@theme/DocRoot/Layout/FetchUser';
import posthog from 'posthog-js';

// 🦔 config
posthog.init('phc_MZpdcQLGf57lyfOUT0XA93R3jaCxGsqftVt4iI4MyUY', {
  api_host: 'https://analytics-posthog.hasura-app.io',
});

export default function DocRootLayout({ children }) {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUser();
        console.log('User fetched:', user);
        posthog.identify(user.data.users[0]?.id, { email: user.data.users[0]?.email });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);

  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      <div className={styles.docRoot}>
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>{children}</DocRootLayoutMain>
        <BrowserOnly fallback={<div>Loading...</div>}>{() => <AiChatBot />}</BrowserOnly>
      </div>
    </div>
  );
}
