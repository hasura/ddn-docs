import React, { useState, useEffect } from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import styles from './styles.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';

export default function DocRootLayout({ children }) {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [chatBotStyle, setChatBotStyle] = useState({});

  useEffect(() => {
    const updateChatBotPosition = () => {
      const feedback = document.getElementById('feedback');
      if (feedback) {
        const feedbackRect = feedback.getBoundingClientRect();
        setChatBotStyle({
          bottom: `${window.innerHeight - feedbackRect.bottom - 40}px`, // Adjust 40px offset
        });
      }
    };

    // Call the function on mount, window resize, and scroll
    window.addEventListener('resize', updateChatBotPosition);
    window.addEventListener('scroll', updateChatBotPosition);
    updateChatBotPosition(); // Initial position adjustment

    // Clean up event listeners to avoid memory leaks
    return () => {
      window.removeEventListener('resize', updateChatBotPosition);
      window.removeEventListener('scroll', updateChatBotPosition);
    };
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
        <BrowserOnly fallback={<div>Loading...</div>}>{() => <AiChatBot style={chatBotStyle} />}</BrowserOnly>
      </div>
    </div>
  );
}
