import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import './styles.css';
import { Example } from './Example';
import { Explainer } from './Explainer';
import { getContent } from './contentLoader';

export const MetadataComponent: React.FC = () => {
  const [linesToHighlight, setLinesToHighlight] = useState<[number, number] | null>(null);
  const [height, setHeight] = useState(0);
  const location = useLocation();

  const updateHighlightedLines = useCallback((range: [number, number]) => {
    setLinesToHighlight(range);
  }, []);

  const { description, example } = getContent();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Adding this in to deal with the dynamic heights
      const adjustExplainerHeight = () => {
        const exampleContainer = document.querySelector('.example-container');
        const explainerContainer = document.querySelector('.explainer-container');

        if (exampleContainer && explainerContainer) {
          setHeight(exampleContainer.clientHeight);

          explainerContainer.setAttribute('style', `height: ${height}px`);
          console.log(`Page: ${location.pathname} | ${height}`);
        }
      };

      adjustExplainerHeight();

      window.addEventListener('resize', adjustExplainerHeight);

      return () => window.removeEventListener('resize', adjustExplainerHeight);
    }
  }, [location, height]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const match = hash.match(/#L(\d+)(?:-(\d+))?/);

      if (match) {
        const startLine = parseInt(match[1], 10);
        const endLine = match[2] ? parseInt(match[2], 10) : startLine;
        setLinesToHighlight([startLine, endLine]);
      }
    }
  }, []);

  return (
    <div className="metadata-container">
      <Explainer explainerText={description} updateHighlightedLines={updateHighlightedLines} />
      <Example example={example} linesToHighlight={linesToHighlight} />
    </div>
  );
};
