import React, { useEffect } from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';
import fetchUser from '@theme/Navbar/FetchUser';
// import posthog from 'posthog-js';

// // 🦔 config
// posthog.init('phc_MZpdcQLGf57lyfOUT0XA93R3jaCxGsqftVt4iI4MyUY', {
//   api_host: 'https://analytics-posthog.hasura-app.io',
// });

export default function Navbar() {
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUser();
        console.log('User fetched:', user);
        // posthog.identify(user.data.users[0]?.id, { email: user.data.users[0]?.email });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
