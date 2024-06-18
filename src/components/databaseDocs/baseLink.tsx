import React, { ReactNode } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface BaseUrlLinkProps {
  to: string;
  text: ReactNode;
}

const BaseUrlLink: React.FC<BaseUrlLinkProps> = ({ to, text }) => {
  const url = useBaseUrl(to);
  return <a href={url}>{text}</a>;
};

export default BaseUrlLink;
