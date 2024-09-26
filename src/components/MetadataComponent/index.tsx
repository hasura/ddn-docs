import React, { useState, useCallback } from 'react';
import './styles.css';
import { Example } from './Example';
import { Explainer } from './Explainer';
import { getContent } from './contentLoader';

export const MetadataComponent: React.FC = () => {
  // We can always start with the line after the delimiter
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([2]);

  const updateHighlightedLines = useCallback((lines: number[]) => {
    setLinesToHighlight(lines);
  }, []);

  const { description, example } = getContent();

  return (
    <div className="metadata-container">
      <Explainer explainerText={description} updateHighlightedLines={updateHighlightedLines} />
      <Example example={example} linesToHighlight={linesToHighlight} />
    </div>
  );
};
