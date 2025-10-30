import db from './init.js';
import { v4 as uuidv4 } from 'uuid';

export const documentQueries = {
  // 생성
  create: db.prepare(`
    INSERT INTO documents (uuid, namespace, title, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `),

  // 조회
  findByNamespaceAndTitle: db.prepare(`
    SELECT * FROM documents WHERE namespace = ? AND title = ?
  `),

  findByUuid: db.prepare(`
    SELECT * FROM documents WHERE uuid = ?
  `),

  // 수정
  updateContent: db.prepare(`
    UPDATE documents 
    SET content = ?, updated_at = ? 
    WHERE id = ?
  `),

  // 목록
  list: db.prepare(`
    SELECT * FROM documents 
    WHERE namespace = ? 
    ORDER BY title 
    LIMIT ? OFFSET ?
  `),

  // 최근 변경
  recentChanges: db.prepare(`
    SELECT d.*, h.created_at as last_edit 
    FROM documents d
    LEFT JOIN history h ON d.id = h.document_id
    WHERE h.id IN (
      SELECT MAX(id) FROM history GROUP BY document_id
    )
    ORDER BY h.created_at DESC
    LIMIT ?
  `),

  // 검색
  search: db.prepare(`
    SELECT * FROM documents 
    WHERE title LIKE ? OR content LIKE ?
    LIMIT ?
  `),

  // 삭제
  delete: db.prepare(`DELETE FROM documents WHERE id = ?`)
};

// 역사
export const historyQueries = {
  // 생성
  create: db.prepare(`
    INSERT INTO history (uuid, document_id, rev, content, log, user_id, ip, created_at, diff_length)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  // 조회
  findByDocument: db.prepare(`
    SELECT h.*, u.username, u.ip as user_ip
    FROM history h
    LEFT JOIN users u ON h.user_id = u.id
    WHERE h.document_id = ?
    ORDER BY h.rev DESC
    LIMIT ? OFFSET ?
  `),

  // 리비전 조회
  findByRev: db.prepare(`
    SELECT h.*, u.username, u.ip as user_ip
    FROM history h
    LEFT JOIN users u ON h.user_id = u.id
    WHERE h.document_id = ? AND h.rev = ?
  `),

  // 최신 리비전 넘버
  getLatestRev: db.prepare(`
    SELECT MAX(rev) as latest_rev 
    FROM history 
    WHERE document_id = ?
  `),

  // 역사 개수
  countByDocument: db.prepare(`
    SELECT COUNT(*) as count FROM history WHERE document_id = ?
  `)
};

export const userQueries = {
  // 생성
  create: db.prepare(`
    INSERT INTO users (uuid, username, email, password, type, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `),

  // IP 사용자 생성
  findOrCreateByIp: db.prepare(`
    INSERT OR IGNORE INTO users (uuid, ip, type, created_at)
    VALUES (?, ?, 'ip', ?)
  `),
  // IP 조회
  findByIp: db.prepare(`
    SELECT * FROM users WHERE ip = ? AND type = 'ip'
  `),

  // 사용자 조회
  findByUsername: db.prepare(`
    SELECT * FROM users WHERE username = ?
  `),

  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

  findByUuid: db.prepare(`
    SELECT * FROM users WHERE uuid = ?
  `),

  // 로그인 시간 업데이트
  updateLastLogin: db.prepare(`
    UPDATE users SET last_login = ? WHERE id = ?
  `)
};
export const backlinkQueries = {
  //업데이트
  addOrUpdate: db.prepare(`
    INSERT OR REPLACE INTO backlinks (source_id, target_namespace, target_title, flags)
    VALUES (?, ?, ?, ?)
  `),

  // 조회
  findByTarget: db.prepare(`
    SELECT d.*, b.flags
    FROM backlinks b
    JOIN documents d ON b.source_id = d.id
    WHERE b.target_namespace = ? AND b.target_title = ?
    ORDER BY d.title
    LIMIT ? OFFSET ?
  `),

  // 개수
  countByTarget: db.prepare(`
    SELECT COUNT(*) as count 
    FROM backlinks 
    WHERE target_namespace = ? AND target_title = ?
  `),

  // 삭제
  deleteBySource: db.prepare(`
    DELETE FROM backlinks WHERE source_id = ?
  `)
};

export const categoryQueries = {
  // 추가
  add: db.prepare(`
    INSERT OR IGNORE INTO categories (document_id, category_name)
    VALUES (?, ?)
  `),

  // 조회
  findByDocument: db.prepare(`
    SELECT category_name FROM categories WHERE document_id = ?
  `),

  // 문서 조회
  findDocumentsByCategory: db.prepare(`
    SELECT d.*
    FROM categories c
    JOIN documents d ON c.document_id = d.id
    WHERE c.category_name = ?
    ORDER BY d.title
    LIMIT ? OFFSET ?
  `),

  // 문서 개수
  countByCategory: db.prepare(`
    SELECT COUNT(*) as count FROM categories WHERE category_name = ?
  `),

  // 삭제
  deleteByDocument: db.prepare(`
    DELETE FROM categories WHERE document_id = ?
  `)
};

export function getOrCreateDocument(namespace, title) {
  let doc = documentQueries.findByNamespaceAndTitle.get(namespace, title);
  
  if (!doc) {
    const uuid = uuidv4();
    const now = Date.now();
    documentQueries.create.run(uuid, namespace, title, null, now, now);
    doc = documentQueries.findByNamespaceAndTitle.get(namespace, title);
  }
  
  return doc;
}

export function createHistory(documentId, content, log, userId, ip) {
  const uuid = uuidv4();
  const latest = historyQueries.getLatestRev.get(documentId);
  const newRev = (latest?.latest_rev || 0) + 1;
  const now = Date.now();
  
  const prevHistory = historyQueries.findByRev.get(documentId, newRev - 1);
  const prevLength = prevHistory?.content?.length || 0;
  const diffLength = content.length - prevLength;
  
  historyQueries.create.run(
    uuid,
    documentId,
    newRev,
    content,
    log,
    userId,
    ip,
    now,
    diffLength
  );
  
  return { rev: newRev, uuid };
}

export function getOrCreateIpUser(ip) {
  let user = userQueries.findByIp.get(ip);
  
  if (!user) {
    const uuid = uuidv4();
    const now = Date.now();
    userQueries.findOrCreateByIp.run(uuid, ip, now);
    user = userQueries.findByIp.get(ip);
  }
  
  return user;
}
