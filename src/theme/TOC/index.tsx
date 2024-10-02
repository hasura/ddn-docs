import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import type { Props as TOCProps } from '@theme/TOC';
import styles from './styles.module.css';
import { useDoc } from '@docusaurus/theme-common/internal';
import { Feedback } from '@site/src/components/Feedback/Feedback';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({ className, ...props }: ExtendedTOCProps): JSX.Element {
  const { metadata } = useDoc();

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems {...props} linkClassName={LINK_CLASS_NAME} linkActiveClassName={LINK_ACTIVE_CLASS_NAME} />
      <Feedback metadata={metadata} />
    </div>
  );
}
