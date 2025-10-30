import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = createClient({
  url: `file:${join(__dirname, 'wikidata.db')}`
});

export async function initDatabase() {
  // 문서
  await db.execute(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      namespace TEXT NOT NULL DEFAULT '문서',
      title TEXT NOT NULL,
      content TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(namespace, title)
    )
  `);

  // 역사
  await db.execute(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      document_id INTEGER NOT NULL,
      rev INTEGER NOT NULL,
      content TEXT,
      log TEXT,
      user_id INTEGER,
      ip TEXT,
      created_at INTEGER NOT NULL,
      diff_length INTEGER DEFAULT 0,
      FOREIGN KEY (document_id) REFERENCES documents(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(document_id, rev)
    )
  `);

  // 사용자
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      ip TEXT,
      type TEXT NOT NULL DEFAULT 'account',
      created_at INTEGER NOT NULL,
      last_login INTEGER
    )
  `);

  // 역링크
  await db.execute(`
    CREATE TABLE IF NOT EXISTS backlinks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id INTEGER NOT NULL,
      target_namespace TEXT NOT NULL,
      target_title TEXT NOT NULL,
      flags INTEGER DEFAULT 0,
      FOREIGN KEY (source_id) REFERENCES documents(id),
      UNIQUE(source_id, target_namespace, target_title)
    )
  `);

  // 분류
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id INTEGER NOT NULL,
      category_name TEXT NOT NULL,
      FOREIGN KEY (document_id) REFERENCES documents(id),
      UNIQUE(document_id, category_name)
    )
  `);

  // 인덱스 생성
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_documents_namespace ON documents(namespace)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_documents_title ON documents(title)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_history_document_id ON history(document_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_history_rev ON history(rev)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_backlinks_target ON backlinks(target_namespace, target_title)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(category_name)`);

  console.log('Database initialized successfully');
}

export default db;
