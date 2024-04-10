import React from 'react';
import DocsRoot from '@theme-original/DocsRoot';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';

export default function DocsRootWrapper(props) {

  function isOnOverview(str) {
    const regex = /(index|overview)\/?$/
    return regex.test(str);
  }

  return (
    <>
      <DocsRoot {...props} />
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => isOnOverview(window?.location?.href) ? <AiChatBot/> : null }
      </BrowserOnly>
    </>
  );
}
