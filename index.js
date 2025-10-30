import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

import { initDatabase } from './database/init.js';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 초기화 및 서버 시작
(async () => {
  const dbPath = path.join(__dirname, 'database', 'wikidata.db');
  if (!existsSync(dbPath)) {
    console.log('Database Initialization...');
    await initDatabase();
  }

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // 대문 리다이렉트
  app.get('/', (req, res) => {
    res.redirect(`/w/${encodeURIComponent(config.frontPage)}`);
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`실행중: http://localhost:${PORT}`);
  });
})();