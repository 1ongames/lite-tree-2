export function renderBr(text) {
  const tokens = [];
  let position = 0;

  const brPattern = /\n|\[br\]/g;
  let match;

  while ((match = brPattern.exec(text)) !== null) {
    if (match.index > position) {
      tokens.push({
        type: 'text',
        content: text.slice(position, match.index)
      });
    }

    tokens.push({
      type: 'br'
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

export const priority = 1;
