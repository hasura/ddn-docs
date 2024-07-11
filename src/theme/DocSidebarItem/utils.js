import React, { useEffect, useState } from 'react';

import CloudDark from '@site/static/icons/cloud-light.svg';
import CloudLight from '@site/static/icons/cloud-dark.svg';

import Introduction from '@site/static/icons/award-02.svg';
import Basics from '@site/static/icons/book-open-01.svg';
import GettingStarted from '@site/static/icons/home-smile.svg';
import Auth from '@site/static/icons/shield-tick.svg';
import Connectors from '@site/static/icons/event-triggers.svg';
import DataDomainModeling from '@site/static/icons/database-01.svg';
import GraphQLAPI from '@site/static/icons/graphql-logo.svg';
import CiCd from '@site/static/icons/upload-cloud-02.svg';
import ProjectConfiguration from '@site/static/icons/dataflow-01.svg';
import HasuraCLI from '@site/static/icons/terminal-square.svg';
import Observability from '@site/static/icons/eye.svg';
import Glossary from '@site/static/icons/box.svg';
import Quickstart from '@site/static/icons/speedometer-04.svg';
import SupergraphModeling from '@site/static/icons/cpu-chip-01.svg';
import Faq from '@site/static/icons/help-square.svg';
import Community from '@site/static/icons/announcement-02.svg';
import Actions from '@site/static/icons/features/actions.svg';
import Help from '@site/static/icons/features/hasura_policies.svg';
import Billing from '@site/static/icons/features/credit-card-check.svg';

import styles from '@site/src/theme/DocSidebarItem/Category/styles.module.css';
import { useColorMode } from '@docusaurus/theme-common';

export function addIconsToLabel(label, className) {
  const { colorMode } = useColorMode();
  const [definedColorMode, setDefinedColorMode] = useState('');

  useEffect(() => {
    setDefinedColorMode(colorMode);
  }, [colorMode]);

  const isDarkMode = definedColorMode === 'dark';

  const cloudIcon = isDarkMode ? <CloudDark /> : <CloudLight />;

  // Conditional rendering for sidebar icons
  let icons;
  switch (className) {
    case 'introduction-icon':
      icons = <Introduction />;
      break;
    case 'basics-icon':
      icons = <Basics />;
      break;
    case 'getting-started-icon':
      icons = <GettingStarted />;
      break;
    case 'auth-icon':
      icons = <Auth />;
      break;
    case 'connectors-icon':
      icons = <Connectors />;
      break;
    case 'data-domain-modeling-icon':
      icons = <DataDomainModeling />;
      break;
    case 'graphQL-api-icon':
      icons = <GraphQLAPI />;
      break;
    case 'ci-cd-icon':
      icons = <CiCd />;
      break;
    case 'project-configuration':
      icons = <ProjectConfiguration />;
      break;
    case 'hasura-cli-icon':
      icons = <HasuraCLI />;
      break;
    case 'observability-icon':
      icons = <Observability />;
      break;
    case 'glossary-icon':
      icons = <Glossary />;
      break;
    case 'quickstart-icon':
      icons = <Quickstart />;
      break;
    case 'supergraph-modeling-icon':
      icons = <SupergraphModeling />;
      break;
    case 'faq-icon':
      icons = <Faq />;
      break;
    case 'community-icon':
      icons = <Community />;
      break;
    case 'billing-icon':
      icons = <Billing />;
      break;
    case 'logic-icon':
      icons = <Actions />;
      break;
    case 'help-icon':
      icons = <Help />;
      break;
  }

  return (
    <div className={styles['sidebar_link_wrapper']}>
      {icons} {label}
    </div>
  );
}
