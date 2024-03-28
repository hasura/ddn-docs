import React from 'react';
import DocsRoot from '@theme-original/DocsRoot';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';

export default function DocsRootWrapper(props) {

  const url = window.location.href

  // show this chatbot style only on index and overview pages
  if (!url.endsWith("/index") && !url.endsWith("/overview")) {
    return (<>
      <DocsRoot {...props} />
    </>)
  }

  return (
    <>
      <DocsRoot {...props} />
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <AiChatBot/>}
      </BrowserOnly>
    </>
  );
}
