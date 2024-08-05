import React, { useEffect, useState } from 'react';
import './styles.css';
import CodeBlock from '@theme/CodeBlock';
import { MDXProvider } from '@mdx-js/react';

const CodeStep = props => {
  const [startIndex, setStartIndex] = useState(null);
  const [directive, setDirective] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (props.children && props.children.length) {
      // find the start of the description by finding the first p tag - everything before that is the directive
      for (let i = 0; i < props.children.length; i++) {
        if (props.children[i].props && props.children[i].type === 'p') {
          setStartIndex(i);
          break;
        }
      }
      setDirective(props.children.slice(0, startIndex));
      setDescription(props.children.slice(startIndex));
    }
  }, [startIndex]);

  return (
    <div className={'step_container'}>
      <div className={'item'}>
        <div className={'heading'}>
          <MDXProvider children={directive} />
        </div>
        <div className={'description'}>
          <MDXProvider children={description} />
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
