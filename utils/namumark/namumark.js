import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rendered = [];

async function loadRenderer() {
  const renderDir = join(__dirname, 'render');
  const files = readdirSync(renderDir).filter(f => f.endsWith('.js'));
  
  // render 폴더의 파일들 로드
  for (const file of files) {
    const module = await import(`./render/${file}`);
    const renderFunc = Object.values(module).find(v => typeof v === 'function' && v.name.startsWith('render'));
    
    rendered.push({
      name: file.replace('.js', ''),
      render: renderFunc,
      priority: module.priority
    });
  }

  // render/macro 폴더의 파일들 로드
  const macroDir = join(__dirname, 'render', 'macro');
  try {
    const macroFiles = readdirSync(macroDir).filter(f => f.endsWith('.js'));
    
    for (const file of macroFiles) {
      const module = await import(`./render/macro/${file}`);
      const renderFunc = Object.values(module).find(v => typeof v === 'function' && v.name.startsWith('render'));
      
      rendered.push({
        name: `macro/${file.replace('.js', '')}`,
        render: renderFunc,
        priority: module.priority || 50 // 기본 우선순위
      });
    }
  } catch (err) {
    // macro 폴더가 없으면 무시
    if (err.code !== 'ENOENT') {
      console.error('Error loading macro renderers:', err);
    }
  }

  rendered.sort((a, b) => a.priority - b.priority);
}

await loadRenderer();

// TODO: 문서 앞/뒤 공백 제거
export function parse(text) {
  if (!text) return [];
  
  text = text.trim();
  
  let tokens = [{ type: 'text', content: text }];
  
  for (let i = 0; i < rendered.length; i++) {
    const renderer = rendered[i];
    
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


  tokens = processOther(tokens);
  
  return tokens;
}

function processOther(tokens) {
  return tokens.map(token => {
    if (token.type !== 'text' && token.content && typeof token.content === 'string') {
      const childTokens = parse(token.content);
      
      if (childTokens.length === 1 && childTokens[0].type === 'text') {
        return { ...token, content: childTokens[0].content };
      }

      const { content, ...rest } = token;
      return { ...rest, other: childTokens };
    }
    
    return token;
  });
}

export default function namumark(text) {
  return parse(text);
}
