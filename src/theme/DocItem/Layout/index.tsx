import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Unlisted from '@theme/Unlisted';

import type { Props } from '@theme/DocItem/Layout';

import styles from './styles.module.css';

interface ExtendedFrontMatter {
  hide_toc_on_initial_load?: boolean;
  is_guide?: boolean;
}

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop = canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? <DocItemTOCDesktop /> : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC();
  const {
    metadata: { unlisted },
    frontMatter,
  } = useDoc();
  const location = useLocation();
  const extendedFrontMatter = frontMatter as ExtendedFrontMatter;

  const hideTOC = extendedFrontMatter.hide_toc_on_initial_load;
  const tocElementRef = useRef<HTMLDivElement>(null);
  const contentElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Using refs here to avoid relying on class selectors where possible
    const tocElement = tocElementRef.current;
    const contentElement = contentElementRef.current;

    // Reminding myself: this works by determining if the class of .metadata-container is in the DOM
    const metadataElement = document.querySelector('.metadata-container');
    // Then, if it is, we check to see if the ToC element is there, too and create an observer
    if (metadataElement && tocElement) {
      const observer = new IntersectionObserver(
        entries => {
          const [entry] = entries;

          if (entry.isIntersecting) {
            contentElement.style.maxWidth = 'unset';
            tocElement.style.display = 'none';
          } else {
            contentElement.style.maxWidth = '75%';
            tocElement.style.display = 'block';
          }
        },
        {
          root: null,
          threshold: 0,
        }
      );

      observer.observe(metadataElement);

      return () => {
        if (metadataElement) observer.unobserve(metadataElement);
      };
    } else {
      if (contentElement) {
        const isOverview = location.pathname.includes('overview');
        const isLanding = location.pathname === '/docs/3.0/index/';
        const isGuide = extendedFrontMatter.is_guide;

        if (isOverview || isGuide || isLanding) {
          contentElement.style.maxWidth = '100%';
        } else {
          contentElement.style.maxWidth = '75%';
        }
      }

      if (tocElement) {
        tocElement.style.display = 'block';
      }
    }
  }, []);

  return (
    <div className="row">
      <div ref={contentElementRef} className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        {unlisted && <Unlisted />}
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && (
        <div ref={tocElementRef} className={clsx('col col--3', hideTOC && 'hidden')}>
          {docTOC.desktop}
        </div>
      )}
    </div>
  );
}
