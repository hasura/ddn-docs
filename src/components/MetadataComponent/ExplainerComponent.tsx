import React, { useEffect, useRef, ReactNode } from 'react';
import './styles.css';

interface ExplainerComponentProps {
  explainerText: ReactNode;
  updateHighlightedLines: (lines: number[]) => void;
}

export const ExplainerComponent: React.FC<ExplainerComponentProps> = ({ explainerText, updateHighlightedLines }) => {
  const modelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modelsRef.current) {
      const h3Elements = modelsRef.current.querySelectorAll('h3');

      const observer = new IntersectionObserver(
        entries => {
          const sortedEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          // Find the top-most h3 element whose top is at the top of the container
          if (sortedEntries.length > 0) {
            const topVisible = sortedEntries[0].target as HTMLElement;
            const anchorTag = topVisible.querySelector('a');
            if (anchorTag) {
              const match = anchorTag.href.match(/#lines(\d+)/);
              if (match) {
                const lineNumber = parseInt(match[1], 10);
                updateHighlightedLines([lineNumber]); // Highlight the top-most h3 element
              }
            }
          }
        },
        {
          // We can use this to reference the current conatiner in which we want to observer the h3s
          root: modelsRef.current,
          // This controls when we want to fire the state change
          rootMargin: '0px 0px -50% 0px',
          // And, finally, we let it know how much of the h3 element needs to be visible
          threshold: 0,
        }
      );

      h3Elements.forEach(h3 => observer.observe(h3));

      return () => {
        h3Elements.forEach(h3 => observer.unobserve(h3));
      };
    }
  }, [updateHighlightedLines]);

  return (
    <div className="explainer-container" ref={modelsRef}>
      {explainerText}
    </div>
  );
};
