import React, { ReactNode } from 'react';
import './styles.css';
import CodeBlock from '@theme/CodeBlock';
import { MDXProvider } from '@mdx-js/react';

interface CodeStepProps {
  language: string;
  code: string;
  heading: string;
  children?: ReactNode;
  output?: string;
}

const CodeStep = (props: CodeStepProps) => {
  return (
    <div className={'step_container'}>
      <div className={'item'}>
        <div className={'heading'}>
          <h2 children={props.heading} />
        </div>
        <div className={'description'}>
          <MDXProvider children={props.children} />
        </div>
      </div>
      <div className={'item'}>
        <CodeBlock className={`language-${props.language} main-block`}>{props.code}</CodeBlock>
        {props.output && (
          <details>
            <summary>Output</summary>
            <CodeBlock className={`language-plaintext`}>{props.output}</CodeBlock>
          </details>
        )}
      </div>
    </div>
  );
};

export default CodeStep;
