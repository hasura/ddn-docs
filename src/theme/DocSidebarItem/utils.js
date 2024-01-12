import React, { useEffect, useState } from 'react';

import CloudDark from '@site/static/icons/cloud-light.svg';
import CloudLight from '@site/static/icons/cloud-dark.svg';

import Introduction from '@site/static/icons/award-02.svg';
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
    case 'enterprise-icon':
      icons = <Introduction />;
      break;
    case 'cloud-icon':
      icons = cloudIcon;
      break;
    case 'enterprise-icon-and-beta':
      icons = (
        <>
          {enterpriseIcon} {betaIcon}
        </>
      );
      break;
    case 'cloud-and-enterprise-icon':
      icons = (
        <>
          {cloudIcon} {enterpriseIcon}
        </>
      );
      break;
  }

  return (
    <div className={styles['sidebar_link_wrapper']}>
      {icons} {label} 
    </div>
  );
}