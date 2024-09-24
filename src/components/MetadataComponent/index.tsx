import React, { useState, useCallback } from 'react';
import './styles.css';
import { ExampleComponent } from './ExampleComponent';
import { ExplainerComponent } from './ExplainerComponent';

// TODO: Create a dynamic component that reads page path and determines what
// to serve...similar to the database docs
import Models from './metadataDocs/models/models.mdx';
import { example } from './metadataDocs/models/example';

export const MetadataComponent = () => {
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);

  const updateHighlightedLines = useCallback((lines: number[]) => {
    setLinesToHighlight(lines);
  }, []);

  return (
    <div className="metadata-container">
      <ExplainerComponent explainerText={<Models />} updateHighlightedLines={updateHighlightedLines} />
      <ExampleComponent example={example} linesToHighlight={linesToHighlight} />
    </div>
  );
};
