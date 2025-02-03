import React from 'react';
// import clsx from 'clsx';
import Layout from '@theme/Layout';
// import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import styles from './index.module.css';
// import useBaseUrl from '@docusaurus/useBaseUrl';
// import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
// import { useDocsSidebar } from '@docusaurus/theme-common/internal';
// import { useState } from 'react';


export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  // const sidebar = useDocsSidebar();


  // const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);

  return (
    <Layout
      title={siteConfig.title}
      description="Hasura gives you instant GraphQL APIs on your data sources. Point Hasura to your preferred internal and external data sources, setup relationships and security rules on your data models across sources and get a managed unified GraphQL API to build modern applications, instantly."
    >


      <main>
                      {/* {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )} */}
        <div>
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </main>
    </Layout>
  );
}
