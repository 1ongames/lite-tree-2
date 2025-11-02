import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rendered = [];

async function loadRenderer() {
  const renderDir = join(__dirname, 'render');
  const files = readdirSync(renderDir).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    const module = await import(`./render/${file}`);
    const renderFunc = Object.values(module).find(v => typeof v === 'function' && v.name.startsWith('render'));
    
    rendered.push({
      name: file.replace('.js', ''),
      render: renderFunc,
      priority: module.priority
    });
  }

  rendered.sort((a, b) => a.priority - b.priority);
}

await loadRenderer();

export function parse(text) {
  if (!text) return [];
  
  let tokens = [{ type: 'text', content: text }];
  
  for (const renderer of rendered) {
    const newTokens = [];
    
    for (const token of tokens) {
      if (token.type === 'text') {
        const renderedTokens = renderer.render(token.content);
        newTokens.push(...renderedTokens);
      } else {
        newTokens.push(token);
      }
    }
    
    tokens = newTokens;
  }
  
  return tokens;
}

export default function namumark(text) {
  return parse(text);
}
