export function renderPlum(text) {
    const tokens = [];
    let position = 0;

    const plumPattern = /\[plum\]/g;
    let match;

    while ((match = plumPattern.exec(text)) !== null) {
        if (match.index > position) {
            tokens.push({
                type: 'text',
                content: text.slice(position, match.index)
            });
        }

        tokens.push({
            type: 'plum'
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

export const priority = 9;