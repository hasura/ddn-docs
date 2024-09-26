export function removeDuplicateH3H4Sections(markdown: string): string {
  const lines = markdown.split('\n');
  const seenHeadings = new Set<string>();
  const resultLines: string[] = [];

  let skipMode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const headingMatch = line.match(/^(#{3,4})\s+(.*)/);
    if (headingMatch) {
      const headingLevel = headingMatch[1];
      const headingText = headingMatch[2].trim();

      // Use a unique key combining heading level and text
      const headingKey = `${headingLevel} ${headingText}`;

      if (seenHeadings.has(headingKey)) {
        // Duplicate heading found, enter skip mode
        skipMode = true;
        continue;
      } else {
        seenHeadings.add(headingKey);
        skipMode = false;
      }
    }

    if (skipMode) {
      continue;
    } else {
      resultLines.push(line);
    }
  }

  return resultLines.join('\n');
}
