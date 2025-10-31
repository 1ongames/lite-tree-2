import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// version.json 로드
let verInfo = {
    "version": {
        "master": "0.1.0",
        "FrontEnd": null,
        "BackEnd": "0.1.0"
    },
    "branch": "master",
    "check_update": "true"
};

try {
  const versionPath = join(__dirname, 'version.json');
  const content = readFileSync(versionPath, 'utf-8');
  verInfo = JSON.parse(content);
} catch (error) {
  console.warn('version.json 파일 로드 실패.');
}

export { verInfo };
export default verInfo;
