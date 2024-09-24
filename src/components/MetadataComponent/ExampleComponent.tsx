import React from 'react';
import './styles.css';
import CodeBlock from '@theme/CodeBlock';

interface ExampleComponentProps {
  example: string;
  linesToHighlight: number[];
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({ example, linesToHighlight }) => {
  return (
    <CodeBlock className={`language-yaml main-block example-container`} metastring={`{${linesToHighlight.join(',')}}`}>
      {example}
    </CodeBlock>
  );
};
