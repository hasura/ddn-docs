import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/theme-common/internal";
import TagsListInline from "@theme/TagsListInline";
import styles from "./styles.module.css";
import { Feedback } from "@site/src/components/Feedback/Feedback";
function TagsRow(props) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        "row margin-bottom--sm"
      )}
    >
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}
export default function DocItemFooter() {
  const { metadata } = useDoc();
  return (
    <>
      <Feedback metadata={metadata} />
      <footer
        className={clsx(ThemeClassNames.docs.docFooter, "docusaurus-mt-lg")}
      ></footer>
    </>
  );
}
