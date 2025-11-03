export function renderLink(text) {
    const tokens = [];
    let position = 0;
  
    // 중첩된 대괄호도 처리할 수 있도록 개선된 패턴
    const linkPattern = /\[\[([^\]]+)\]\]/g;
    let match;

    const external = /^(https?:\/\/|http:|ftp:\/\/|ftps:\/\/|file:\/\/)/i;

    while ((match = linkPattern.exec(text)) !== null) {
        if (match.index > position) {
            tokens.push({
                type: 'text',
                content: text.slice(position, match.index)
            });
        }
    
        const linkText = match[1];
        const pipeIndex = linkText.indexOf('|');
        const target = pipeIndex !== -1 ? linkText.substring(0, pipeIndex).trim() : linkText.trim();
        const display = pipeIndex !== -1 ? linkText.substring(pipeIndex + 1).trim() : target;
        
        const isExternal = external.test(target);
    
        tokens.push({
            type: 'link',
            target: target,
            isExternal: isExternal,
            content: display 
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
export const priority = 3;  // 가장 먼저 처리
