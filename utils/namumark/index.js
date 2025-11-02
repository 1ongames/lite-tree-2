import namumark, { parse } from './namumark.js';
import { toHTML } from './html.js';

export function render(text) {
  const tokens = parse(text);
  return toHTML(tokens);
}

export { parse };

export { toHTML };

export default render;
