import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { findFirstSidebarItemLink, useDocById } from '@docusaurus/theme-common/internal';
import { usePluralForm } from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { translate } from '@docusaurus/Translate';

import type { Props } from '@theme/DocCard';
import Heading from '@theme/Heading';
import type { PropSidebarItemCategory, PropSidebarItemLink } from '@docusaurus/plugin-content-docs';

import styles from './styles.module.css';

function useCategoryItemsPlural() {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          message: '1 item|{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        { count }
      )
    );
}

function CardLayout({ href, title, description }: { href: string; title: string; description?: string }): JSX.Element {
  return (
    <div className={styles.headingContainer}>
      <Link href={href}>
        <Heading as="h2" className={styles.title}>
          {title}
        </Heading>
      </Link>
      {description && <p className={styles.description}>{description} - Read More</p>}
    </div>
  );
}

function CardCategory({ item }: { item: PropSidebarItemCategory }): JSX.Element | null {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  const description =
    item.description ?? (item.customProps?.description as string) ?? categoryItemsPlural(item.items.length);

  if (!href) {
    return null;
  }

  return <CardLayout href={href} title={item.label} description={description} />;
}

function CardLink({ item }: { item: PropSidebarItemLink }): JSX.Element {
  const doc = useDocById(item.docId ?? undefined);
  return <CardLayout href={item.href} title={item.label} description={item.description ?? doc?.description} />;
}

export default function DocCard({ item }: Props): JSX.Element {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
