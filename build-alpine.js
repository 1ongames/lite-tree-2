import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Alpine.js 번들 생성
const alpineStore = readFileSync(join(__dirname, 'public', 'js', 'alpine-store.js'), 'utf-8');

// Alpine.js를 CDN으로 변경 (서버 사이드 import 제거)
const clientCode = alpineStore.replace(
  "import Alpine from 'alpinejs';",
  "// Alpine.js는 CDN으로 로드됩니다"
);

writeFileSync(join(__dirname, 'public', 'js', 'alpine-store.js'), clientCode);
console.log('Alpine.js store 빌드 완료!');
