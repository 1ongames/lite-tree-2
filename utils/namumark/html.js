export function toHTML(tokens) {
    if (!tokens || tokens.length === 0) return '';
  
    return tokens.map(token => {
        switch (token.type) {
        case 'text':
            // XSS 방지
            return escapeHtml(token.content);
      
        case 'link':
            const href = `/w/${encodeURIComponent(token.target)}`;
            const display = escapeHtml(token.display);
            return `<a href="${href}" class="wiki-link">${display}</a>`;
      
        //case 'br':
            //return '<br />';
        
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
