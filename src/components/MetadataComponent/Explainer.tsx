import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import './styles.css';

interface ExplainerComponentProps {
  explainerText: ReactNode;
  updateHighlightedLines: (lines: [number, number]) => void;
}

export const Explainer: React.FC<ExplainerComponentProps> = ({ explainerText, updateHighlightedLines }) => {
  const modelsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [hasURLHighlight, setHasURLHighlight] = useState(false);

  const history = useHistory();

  const handleClick = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const pTag = target.closest('p');
    if (pTag) {
      const anchorTag = target.closest('h3')?.querySelector('a') || target.previousElementSibling?.querySelector('a');
      if (anchorTag) {
        const match = anchorTag.href.match(/#L(\d+)(?:-(\d+))?/);
        if (match) {
          const startLine = parseInt(match[1], 10);
          const endLine = match[2] ? parseInt(match[2], 10) : startLine;
          updateHighlightedLines([startLine, endLine]);

          if (activeElement) {
            activeElement.classList.remove('metadata-active');
          }

          pTag.classList.add('metadata-active');
          setActiveElement(pTag);

          if (typeof window !== 'undefined') {
            const anchorHref = anchorTag.getAttribute('href');
            if (anchorHref) {
              window.history.replaceState(null, '', anchorHref);
            }
          }

          setIsClicking(true);
        }
      }
    }
  };

  const setupIntersectionObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const h3Elements = modelsRef.current?.querySelectorAll('h3');
    if (!h3Elements || h3Elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (isClicking || hasURLHighlight) return;

        const sortedEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (sortedEntries.length > 0) {
          const topVisible = sortedEntries[0].target as HTMLElement;
          const pTag = topVisible.nextElementSibling as HTMLElement;

          if (pTag && pTag.tagName.toLowerCase() === 'p') {
            const anchorTag = topVisible.querySelector('a');
            if (anchorTag) {
              const match = anchorTag.href.match(/#L(\d+)(?:-(\d+))?/);
              if (match) {
                const startLine = parseInt(match[1], 10);
                const endLine = match[2] ? parseInt(match[2], 10) : startLine;
                updateHighlightedLines([startLine, endLine]);

                if (activeElement) {
                  activeElement.classList.remove('metadata-active');
                }

                pTag.classList.add('metadata-active');
                setActiveElement(pTag);
              }
            }
          }
        }
      },
      {
        root: modelsRef.current,
        rootMargin: '0px 0px -75% 0px',
        threshold: 0,
      }
    );

    h3Elements.forEach(h3 => {
      observer.observe(h3);

      let nextSibling = h3.nextElementSibling;
      while (nextSibling && nextSibling.tagName.toLowerCase() !== 'h3') {
        if (nextSibling.tagName.toLowerCase() === 'p') {
          nextSibling.addEventListener('click', handleClick);
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    });

    observerRef.current = observer;
  };

  useEffect(() => {
    if (modelsRef.current) {
      setupIntersectionObserver();

      const mutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            setupIntersectionObserver();
            if (mutationObserverRef.current) {
              mutationObserverRef.current.disconnect();
              mutationObserverRef.current = null;
            }
            break;
          }
        }
      });

      mutationObserver.observe(modelsRef.current, { childList: true, subtree: true });
      mutationObserverRef.current = mutationObserver;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        if (mutationObserverRef.current) {
          mutationObserverRef.current.disconnect();
          mutationObserverRef.current = null;
        }

        const h3Elements = modelsRef.current?.querySelectorAll('h3');
        h3Elements?.forEach(h3 => {
          let nextSibling = h3.nextElementSibling;
          while (nextSibling && nextSibling.tagName.toLowerCase() !== 'h3') {
            if (nextSibling.tagName.toLowerCase() === 'p') {
              nextSibling.removeEventListener('click', handleClick);
            }
            nextSibling = nextSibling.nextElementSibling;
          }
        });
      };
    }
  }, [updateHighlightedLines, explainerText, isClicking, activeElement]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const match = hash.match(/#L(\d+)(?:-(\d+))?/);

      if (match) {
        const startLine = parseInt(match[1], 10);
        const endLine = match[2] ? parseInt(match[2], 10) : startLine;
        updateHighlightedLines([startLine, endLine]);
        setHasURLHighlight(true);
      }
    }
  }, []);

  return (
    <div className="explainer-container" ref={modelsRef}>
      {explainerText}
    </div>
  );
};
