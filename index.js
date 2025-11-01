import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import axios from 'axios';
import nunjucks from 'nunjucks';

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
  
  // 뷰 설정
  const skinName = config.public?.skin || 'central';
  app.set('view engine', 'html');
  
  nunjucks.configure([
    path.join(__dirname, 'views'),
    path.join(__dirname, 'skins', skinName)
  ], {
    autoescape: true,
    express: app,
    noCache: process.env.NODE_ENV !== 'production'
  });

  // 정적 파일 제공
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/skins', express.static(path.join(__dirname, 'skins')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  async function checkSkinUpdate() {
    // TODO: 이거 구현
  }

  // 서버 시작
  app.listen(config.server.server_port || 3000, () => {
    console.log(`실행중: http://localhost:${config.server.server_port || 3000}`);
  });
})();

export default {
  checkUpdate
}