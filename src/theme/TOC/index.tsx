import React, { useEffect } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import type { Props as TOCProps } from '@theme/TOC';
import styles from './styles.module.css';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

// Initially thought this was needed. However, we can probably "unswizzle" this.
interface ExtendedTOCProps extends TOCProps {
  isTocHiddenOnInitialLoad?: boolean;
}

export default function TOC({ className, isTocHiddenOnInitialLoad, ...props }: ExtendedTOCProps): JSX.Element {
  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems {...props} linkClassName={LINK_CLASS_NAME} linkActiveClassName={LINK_ACTIVE_CLASS_NAME} />
    </div>
  );
}
