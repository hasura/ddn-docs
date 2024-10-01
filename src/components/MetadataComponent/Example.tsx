import React from 'react';
import './styles.css';
import CodeBlock from '@theme/CodeBlock';

interface ExampleComponentProps {
  example: string;
  linesToHighlight: [number, number] | null;
}

export const Example: React.FC<ExampleComponentProps> = ({ example, linesToHighlight }) => {
  const metastring = linesToHighlight ? `{${linesToHighlight[0]}-${linesToHighlight[1]}}` : '';

  return (
    <CodeBlock className={`language-yaml example-container`} metastring={metastring}>
      {example}
    </CodeBlock>
  );
};
