import React from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';
import UserFetcher from '@theme/Navbar/Posthog';
export default function Navbar() {
  return (
    <NavbarLayout>
      <UserFetcher />
      <NavbarContent />
    </NavbarLayout>
  );
}
