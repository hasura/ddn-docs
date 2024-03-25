import React from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';
import { AiChatBot } from '@site/src/components/AiChatBot/AiChatBot';
import BrowserOnly from '@docusaurus/BrowserOnly';
export default function Navbar() {
  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
