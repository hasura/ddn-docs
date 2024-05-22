import React, { useState } from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import styles from './styles.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';
import UserFetcher from '@theme/DocRoot/Layout/Posthog';

export default function DocRootLayout({ children }) {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      <UserFetcher />
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
