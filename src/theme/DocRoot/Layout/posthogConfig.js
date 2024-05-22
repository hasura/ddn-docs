import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';

// 🦔 config
posthog.init('phc_MZpdcQLGf57lyfOUT0XA93R3jaCxGsqftVt4iI4MyUY', {
  api_host: 'https://analytics-posthog.hasura-app.io',
});

async function fetchUser() {
  const url = 'https://data.pro.hasura.io/v1/graphql';

  const headers = {
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9,es-US;q=0.8,es;q=0.7',
    'Content-Type': 'application/json',
    'Hasura-Client-Name': 'hasura-docs',
    Origin: 'https://hasura.io/docs/3.0',
    Referer: 'https://hasura.io/docs/3.0',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
  };

  const body = {
    query: `
    query fetchCurrentUser {
      users {
        id
        email
      }
    }
    `,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default function UserFetcher() {
  const [docsUser, setDocsUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const user = await fetchUser();
      if (user) {
        setDocsUser(user);
        posthog.identify(user.data.users[0]?.id, { email: user.data.users[0]?.email });
      }
    }

    getUser();
  }, []);

  return null;
}
