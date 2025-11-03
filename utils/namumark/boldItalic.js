/* export function renderBoldItalic(text) {
    const tokens = [];
    let position = 0;
  
    const boldItalicPattern = /\'\'\'\'\'(.*?)\'\'\'\'\'/g;
    let match;
  
    while ((match = boldItalicPattern.exec(text)) !== null) {
    if (match.index > position) {
        tokens.push({
            type: 'text',
            content: text.slice(position, match.index)
        });
        }
    
        tokens.push({
            type: 'bold_italic',
            content: match[1]
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
*/