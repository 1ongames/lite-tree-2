export function renderLink(text) {
  const tokens = [];
  let position = 0;
  
  const linkPattern = /\[\[([^\]]+)\]\]/g;
  let match;
  
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > position) {
      tokens.push({
        type: 'text',
        content: text.slice(position, match.index)
      });
    }
    
    const linkText = match[1];
    const parts = linkText.split('|');
    
    tokens.push({
      type: 'link',
      target: parts[0].trim(),
      display: parts[1] ? parts[1].trim() : parts[0].trim()
    });
    
    position = match.index + match[0].length;
  }
  
  if (position < text.length) {
    tokens.push({
      type: 'text',
      content: text.slice(position)
    });
  }
  
  return tokens;
}

export const priority = 2;
