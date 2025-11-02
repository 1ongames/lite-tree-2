export function toHTML(tokens) {
    if (!tokens || tokens.length === 0) return '';
    // ㅅㅂ 주석 없으니까 코드 못 읽겠네
    return tokens.map(token => {
        switch (token.type) {
        case 'text':
            // XSS 방지
            return escapeHtml(token.content);
      
        case 'link':
            let href;
            let display = escapeHtml(token.display);

            if (token.isExternal == true) {
                href = escapeHtml(token.target);
                return `<a href="${href}" class="wiki-external-link" target="_blank" rel="noopener noreferrer">${display}</a>`;
            } else {
                href = `/w/${encodeURIComponent(token.target)}`;
                return `<a href="${href}" class="wiki-link">${display}</a>`;
            }
      
        case 'br':
            return '<br />';

        case 'bold':
            if (token.other && Array.isArray(token.other)) {
                return `<b>${toHTML(token.other)}</b>`;
            }
            return `<b>${escapeHtml(token.content || '')}</b>`;
        
        case 'italic':
            if (token.other && Array.isArray(token.other)) {
                return `<i>${toHTML(token.other)}</i>`;
            }
            return `<i>${escapeHtml(token.content || '')}</i>`;
        
        case 'bold_italic':
            if (token.other && Array.isArray(token.other)) {
                return `<b><i>${toHTML(token.other)}</i></b>`;
            }
            return `<b><i>${escapeHtml(token.content || '')}</i></b>`;

        default:
            return escapeHtml(String(token.content || ''));
        }
    }).join('');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

export default toHTML;
