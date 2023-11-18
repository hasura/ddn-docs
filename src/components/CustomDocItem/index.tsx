import React, { useEffect } from 'react';
import ActualDocItem from '@theme/DocItem';
import HasuraConBanner from '@site/src/components/HasuraConBanner';
import GraphQLWithHasuraBanner from '@site/src/components/GraphQLWithHasuraBanner';
import CustomFooter from '@site/src/components/CustomFooter';
import styles from './styles.module.scss';
import { Redirect } from '@docusaurus/router';
import BrowserOnly from "@docusaurus/BrowserOnly";
import AiChatBot from "@site/src/components/AiChatBot/AiChatBot";

const CustomDocItem = props => {
  useEffect(() => {
    // This function is adds <wbr> tags to code blocks within a table
    // wherever an _ or . is present. We do this since so many environment
    // variables are incredibly long and the word breaks are not happening
    // in a user-friendly way.
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const cells = table.querySelectorAll('td');
      cells.forEach(cell => {
        const codeBlocks = cell.querySelectorAll('code');
        codeBlocks.forEach(codeBlock => {
          codeBlock.innerHTML = codeBlock.innerHTML.replace(/_/g, '_<wbr>');
          codeBlock.innerHTML = codeBlock.innerHTML.replace(/\./g, '.<wbr>');
          console.log(codeBlock.innerHTML);
        });
      });
    });

    // dynamically updating the pg prop for the getting started cta
    function updateGettingStartedParam() {
      const linkElement = document.querySelector('.navbar__link.nav-link_getting-started');

      if (linkElement) {
        let page = props.location.pathname;
        page = page.slice(0, -1);
        page = page.slice(1);
        page = page.replace('docs/3.0/', 'docs_v3_').replace(/\//g, '_');

        const href = linkElement.getAttribute('href');
        const newHref = href.replace(/pg=docs_v3_([^&]+)/, `pg=${page}`);
        linkElement.setAttribute('href', newHref);
      }
    }

    updateGettingStartedParam();
  }, []);

  useEffect(() => {
    // check for the browser
    if (typeof window !== 'undefined') {
      let directives = document.body.querySelectorAll('[class*="code_heading"]');
      console.log(directives);
      if (directives.length > 0) {
        for (let i = 0; i < directives.length; i++) {
          directives[i].setAttribute('data-step', i + 1);
        }
      }
      let steps = document.body.querySelectorAll('[class*="step_container"]');
      // get the firs element and add a margin-top of 50px
      if (steps.length > 0) {
        steps[0].setAttribute('style', 'margin-top: 75px');
      }
    }
  });

  // redirect them to the index if they attempt to directly navigate to a path with
  // _heading_ in it
  if (props.location.pathname.includes('_heading_')) {
    return <Redirect to="/docs/index/" />;
  }

  return (
    <div
      className={
        props.location.pathname === `/index/`
          ? `custom_doc_item_wrapper custom_doc_item_wrapper-x-wide`
          : `custom_doc_item_wrapper ${styles['custom_doc_item_wrapper']}`
      }
    >
      <ActualDocItem {...props} />
      <div
        className={
          props.location.pathname === `/index/` || props.location.pathname.includes('overview')
            ? `custom_doc_item_footer-x-wide`
            : styles['custom_doc_item_footer']
        }
      >
        {/* <GraphQLWithHasuraBanner /> */}
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => <AiChatBot/>}
        </BrowserOnly>
        <CustomFooter />
      </div>
    </div>
  );
};

export default CustomDocItem;
