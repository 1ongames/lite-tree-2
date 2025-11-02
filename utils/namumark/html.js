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
        
        case 'plum':
            return '<a class="wiki-external-link" href="https://www.youtube.com/watch?v=s0T83BIH0m0" target="_blank">너는 얻다 달걀 부활절</a>';
            
        case 'underline':
            if (token.other && Array.isArray(token.other)) {
                return `<u>${toHTML(token.other)}</u>`;
            }
            return `<u>${escapeHtml(token.content || '')}</u>`;

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
