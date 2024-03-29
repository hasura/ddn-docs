import React from 'react';
import DocsRoot from '@theme-original/DocsRoot';
// import BrowserOnly from '@docusaurus/BrowserOnly';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';

export default function DocsRootWrapper(props) {

  return (
    <>
      <DocsRoot {...props} />
      <AiChatBot/>
      {/* <BrowserOnly fallback={<div>Loading...</div>}>
        {() => (!window.location.href.endsWith("/index") && !window.location.href.endsWith("/overview") && !window.location.href.endsWith("/overview/")) ? null : <AiChatBot/>}
      </BrowserOnly> */}
    </>
  );
}
