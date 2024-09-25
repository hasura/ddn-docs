import React, { useState, useCallback, useEffect, useRef } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import './styles.css';
import { ExampleComponent } from './ExampleComponent';
import { ExplainerComponent } from './ExplainerComponent';
import Models from './metadataDocs/models/models.mdx';
import { example } from './metadataDocs/models/example';

export const MetadataComponent = () => {
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);
  const metadataContainerRef = useRef<HTMLDivElement | null>(null);

  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (isBrowser) {
      const tocElement = document.querySelector('.col.col--3');
      const metadataElement = metadataContainerRef.current;

      document.body.classList.add('metadata-active');

      if (tocElement && metadataElement) {
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
          @media (min-width: 997px) {
            [class*="docItemCol"] {
              max-width: unset !important;
            }
          }
        `;

        const observer = new IntersectionObserver(
          entries => {
            const [entry] = entries;

            if (entry.isIntersecting) {
              if (tocElement) {
                tocElement.style.display = 'none';
              }
              document.head.appendChild(styleSheet);
            } else {
              if (tocElement) {
                tocElement.style.display = 'block';
              }
              if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
              }
            }
          },
          {
            root: null,
            threshold: 0,
          }
        );

        if (metadataElement) {
          observer.observe(metadataElement);
        }

        return () => {
          if (metadataElement) {
            observer.unobserve(metadataElement);
          }
          if (document.head.contains(styleSheet)) {
            document.head.removeChild(styleSheet);
          }
        };
      }

      // Remove the class when component unmounts to keep things tidy for other pages
      return () => {
        document.body.classList.remove('metadata-active');
      };
    }
  }, [isBrowser]);

  const updateHighlightedLines = useCallback((lines: number[]) => {
    setLinesToHighlight(lines);
  }, []);

  return (
    <div ref={metadataContainerRef} className="metadata-container">
      <ExplainerComponent explainerText={<Models />} updateHighlightedLines={updateHighlightedLines} />
      <ExampleComponent example={example} linesToHighlight={linesToHighlight} />
    </div>
  );
};
