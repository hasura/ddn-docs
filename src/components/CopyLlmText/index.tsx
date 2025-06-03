import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function CopyLLM() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const FILE_NAME = 'llms-full.txt';

  const fileUrl = useBaseUrl(`/${FILE_NAME}`);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleCopy() {
    let showLoadingTimer: NodeJS.Timeout | undefined;

    try {
      // Adding a timer to deal with debouncing and janky issues
      showLoadingTimer = setTimeout(() => {
        setStatus('loading');
      }, 300);

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file.');
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);

      clearTimeout(showLoadingTimer);
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (err) {
      console.error(err);
      clearTimeout(showLoadingTimer);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  }

  async function handleDownload() {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file.');
      }
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = FILE_NAME;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button className={styles.ellipsisButton} onClick={() => setIsOpen(!isOpen)} aria-label="Document actions">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="5" cy="12" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={handleCopy} disabled={status === 'loading'}>
            {status === 'loading'
              ? 'Copying...'
              : status === 'success'
              ? '✅ Copied!'
              : status === 'error'
              ? 'Failed to copy'
              : 'Copy all docs content to clipboard for use in LLM prompts'}
          </button>
          <button className={styles.dropdownItem} onClick={handleDownload}>
            Download docs content
          </button>
        </div>
      )}
    </div>
  );
}
