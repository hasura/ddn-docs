import React, { useState, useCallback } from 'react';
import './styles.css';
import { ExampleComponent } from './ExampleComponent';
import { ExplainerComponent } from './ExplainerComponent';
import { getContent } from './contentLoader';

export const MetadataComponent: React.FC<MetadataComponentProps> = ({ isTocHiddenOnInitialLoad }) => {
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([2]);

  const updateHighlightedLines = useCallback((lines: number[]) => {
    setLinesToHighlight(lines);
  }, []);

  const { description, example } = getContent();

  return (
    <div className="metadata-container">
      <ExplainerComponent explainerText={description} updateHighlightedLines={updateHighlightedLines} />
      <ExampleComponent example={example} linesToHighlight={linesToHighlight} />
    </div>
  );
};
