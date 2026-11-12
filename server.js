const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database ──────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'bookstore.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    interests  TEXT NOT NULL,
    contact    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS feedback (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    rating     INTEGER,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertCustomer = db.prepare(
  'INSERT INTO customers (name, interests, contact) VALUES (?, ?, ?)'
);
const insertFeedback = db.prepare(
  'INSERT INTO feedback (name, rating, message) VALUES (?, ?, ?)'
);

// ── Middleware ────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── API: registration ─────────────────────────────────────
app.post('/api/register', (req, res) => {
  const name = String(req.body.name || '').trim();
  const interests = Array.isArray(req.body.interests)
    ? req.body.interests.map(String).join(', ')
    : '';
  const contact = String(req.body.contact || '').trim();

  // Server-side validation (never trust the browser alone)
  if (!name || !interests || !/^\d{7,15}$/.test(contact)) {
    return res.status(400).json({ ok: false, error: 'Please fill in all fields correctly.' });
  }

  const info = insertCustomer.run(name.slice(0, 100), interests.slice(0, 200), contact);
  res.json({ ok: true, id: info.lastInsertRowid });
});

// ── API: feedback ─────────────────────────────────────────
app.post('/api/feedback', (req, res) => {
  const name = String(req.body.name || '').trim();
  const message = String(req.body.message || '').trim();
  let rating = parseInt(req.body.rating, 10);
  if (!(rating >= 1 && rating <= 5)) rating = null;

  if (!name || message.length < 20) {
    return res.status(400).json({ ok: false, error: 'Please enter your name and at least 20 characters of feedback.' });
  }

  const info = insertFeedback.run(name.slice(0, 100), rating, message.slice(0, 600));
  res.json({ ok: true, id: info.lastInsertRowid });
});

// ── API: view stored data (used by admin.html) ────────────
app.get('/api/customers', (req, res) => {
  res.json(db.prepare('SELECT * FROM customers ORDER BY id DESC').all());
});
app.get('/api/feedback', (req, res) => {
  res.json(db.prepare('SELECT * FROM feedback ORDER BY id DESC').all());
});

app.listen(PORT, () => {
  console.log(`Folio & Ink running at http://localhost:${PORT}`);
  console.log(`View stored responses at http://localhost:${PORT}/admin.html`);
});
