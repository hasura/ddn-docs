import React from 'react';
import { useLocation } from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';

/* Models */
import { modelExample } from './metadataDocs/models/example';
import ModelDescription from './metadataDocs/models/description.mdx';

/* Commands */
import { commandExample } from './metadataDocs/commands/example';
import CommandDescription from './metadataDocs/commands/description.mdx';

export const getContent = () => {
  const isBrowser = useIsBrowser();
  const location = useLocation();

  if (!isBrowser) {
    return { description: <div />, example: null };
  }

  const pathParts = location.pathname.split('/').filter(Boolean);
  const route = pathParts.pop();

  switch (route) {
    case 'models':
      return { description: <ModelDescription />, example: modelExample };
    case 'commands':
      return { description: <CommandDescription />, example: commandExample };
    default:
      return { description: <div />, example: null };
  }
};
