import React, { useEffect, useRef, ReactNode } from 'react';
import './styles.css';

interface ExplainerComponentProps {
  explainerText: ReactNode;
  updateHighlightedLines: (lines: number[]) => void;
}

export const Explainer: React.FC<ExplainerComponentProps> = ({ explainerText, updateHighlightedLines }) => {
  const modelsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (modelsRef.current) {
      const node = modelsRef.current;

      const setupIntersectionObserver = () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        const h3Elements = node.querySelectorAll('h3');
        if (h3Elements.length === 0) {
          // Having to do this because we're loading the content dynamically
          // and, at first, there's no h3s
          return;
        }

        const observer = new IntersectionObserver(
          entries => {
            const sortedEntries = entries
              .filter(entry => entry.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (sortedEntries.length > 0) {
              const topVisible = sortedEntries[0].target as HTMLElement;
              const anchorTag = topVisible.querySelector('a');
              if (anchorTag) {
                const match = anchorTag.href.match(/#lines(\d+)/);
                if (match) {
                  const lineNumber = parseInt(match[1], 10);
                  updateHighlightedLines([lineNumber]);
                }
              }
            }
          },
          {
            root: node,
            rootMargin: '0px 0px -75% 0px',
            threshold: 0,
          }
        );

        h3Elements.forEach(h3 => observer.observe(h3));

        observerRef.current = observer;
      };

      // MutationObserver to watch for DOM changes
      const mutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Any new h3s?
            const h3Elements = node.querySelectorAll('h3');
            if (h3Elements.length > 0) {
              setupIntersectionObserver();
              // Once they're in, we can disconnect this
              if (mutationObserverRef.current) {
                mutationObserverRef.current.disconnect();
                mutationObserverRef.current = null;
              }
              break;
            }
          }
        }
      });

      mutationObserver.observe(node, { childList: true, subtree: true });
      mutationObserverRef.current = mutationObserver;

      setupIntersectionObserver();

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        if (mutationObserverRef.current) {
          mutationObserverRef.current.disconnect();
          mutationObserverRef.current = null;
        }
      };
    }
  }, [updateHighlightedLines, explainerText]);

  return (
    <div className="explainer-container" ref={modelsRef}>
      {explainerText}
    </div>
  );
};
