import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import axios from 'axios';

import { initDatabase } from './database/init.js';
import config from './config.js';
import { verInfo } from './version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 데이터베이스 초기화 및 서버 시작
(async () => {
  const dbPath = path.join(__dirname, 'database', 'wikidata.db');
  if (!existsSync(dbPath)) {
    console.log('Database Initialization...');
    await initDatabase();
  }

  // 기본 설정
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // 대문 리다이렉트
  app.get('/', (req, res) => {
    res.redirect(`/w/${encodeURIComponent(config.public?.wiki_FrontPage || 'FrontPage')}`);
  });

  // 업데이트 체크
  async function checkUpdate() {
    if (verInfo.check_update !== 'true') return;
    const response = await axios.create({
      baseURL: verInfo.branch === 'beta' ? 'https://api.github.com/repos/1ongames/lite-tree-2/commits/beta' : 'https://api.github.com/repos/1ongames/lite-tree-2/releases/latest',
      headers: config.dev.github_token ? { Authorization: `token ${config.dev.github_token}` } : {}
    });
  }

  // 서버 시작
  app.listen(config.server.server_port || 3000, () => {
    console.log(`실행중: http://localhost:${config.server.server_port || 3000}`);
  });
})();

export default {
  checkUpdate
}