import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import styles from './styles.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';
import fetchUser from '@theme/DocRoot/Layout/FetchUser';
import posthog from 'posthog-js';

export default function DocRootLayout({ children }) {
  const sidebar = useDocsSidebar();
  const location = useLocation();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init('phc_MZpdcQLGf57lyfOUT0XA93R3jaCxGsqftVt4iI4MyUY', {
        api_host: 'https://analytics-posthog.hasura-app.io',
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.capture('$pageview');
    }

    const getUser = async () => {
      try {
        const user = await fetchUser();
        // TODO: When the allowlist in Lux is updated, uncomment this and test on stage.hasura.io
        // posthog.identify(user.data.users[0]?.id, { email: user.data.users[0]?.email });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, [location]);

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
