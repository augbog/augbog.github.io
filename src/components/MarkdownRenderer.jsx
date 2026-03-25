/**
 * Simple markdown-to-JSX renderer. Handles headings, paragraphs, bold,
 * italic, inline code, code blocks, links, blockquotes, and lists.
 * No external dependency needed.
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={key++} style={{ background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level}`;
      const sizes = { 1: '2rem', 2: '1.5rem', 3: '1.25rem', 4: '1.1rem', 5: '1rem', 6: '0.9rem' };
      elements.push(
        <Tag key={key++} style={{ fontSize: sizes[level], fontWeight: 600, margin: '1.5em 0 0.5em', lineHeight: 1.3 }}>
          {renderInline(text)}
        </Tag>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote key={key++} style={{ borderLeft: '3px solid rgba(0,0,0,0.2)', paddingLeft: '1rem', margin: '1.5em 0', fontStyle: 'italic', opacity: 0.85 }}>
          {quoteLines.map((ql, qi) => <p key={qi} style={{ margin: '0.25em 0' }}>{renderInline(ql)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={key++} style={{ paddingLeft: '1.5rem', margin: '1em 0', listStyleType: 'disc' }}>
          {items.map((item, ii) => <li key={ii} style={{ margin: '0.3em 0', lineHeight: 1.6 }}>{renderInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} style={{ paddingLeft: '1.5rem', margin: '1em 0' }}>
          {items.map((item, ii) => <li key={ii} style={{ margin: '0.3em 0', lineHeight: 1.6 }}>{renderInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '2em 0' }} />);
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} style={{ margin: '1em 0', lineHeight: 1.7 }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text) {
  // Process inline markdown: bold, italic, code, links
  const parts = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    // Link: [text](url)
    const linkMatch = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)/s);
    // Bold: **text**
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
    // Italic: *text* (but not **)
    const italicMatch = remaining.match(/^(.*?)(?<!\*)\*([^*]+)\*(?!\*)(.*)/s);
    // Inline code: `text`
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)/s);

    // Find the earliest match
    const matches = [
      linkMatch && { type: 'link', index: linkMatch[1].length, match: linkMatch },
      boldMatch && { type: 'bold', index: boldMatch[1].length, match: boldMatch },
      italicMatch && { type: 'italic', index: italicMatch[1].length, match: italicMatch },
      codeMatch && { type: 'code', index: codeMatch[1].length, match: codeMatch },
    ].filter(Boolean);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const best = matches[0];

    if (best.match[1]) {
      parts.push(best.match[1]);
    }

    switch (best.type) {
      case 'link':
        parts.push(<a key={k++} href={best.match[3]} style={{ borderBottom: '1px solid currentColor' }}>{best.match[2]}</a>);
        remaining = best.match[4];
        break;
      case 'bold':
        parts.push(<strong key={k++}>{best.match[2]}</strong>);
        remaining = best.match[3];
        break;
      case 'italic':
        parts.push(<em key={k++}>{best.match[2]}</em>);
        remaining = best.match[3];
        break;
      case 'code':
        parts.push(<code key={k++} style={{ background: 'rgba(0,0,0,0.06)', padding: '0.15em 0.4em', borderRadius: '3px', fontSize: '0.9em' }}>{best.match[2]}</code>);
        remaining = best.match[3];
        break;
    }
  }

  return parts;
}
