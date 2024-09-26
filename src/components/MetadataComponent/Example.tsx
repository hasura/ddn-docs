import React from 'react';
import './styles.css';
import CodeBlock from '@theme/CodeBlock';

interface ExampleComponentProps {
  example: string;
  linesToHighlight: number[];
}

export const Example: React.FC<ExampleComponentProps> = ({ example, linesToHighlight }) => {
  return (
    <CodeBlock className={`language-yaml example-container`} metastring={`{${linesToHighlight.join(',')}}`}>
      {example}
    </CodeBlock>
  );
};
