const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tarefas.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE,
      custo REAL,
      data_limite TEXT,
      ordem INTEGER UNIQUE
    )
  `);
});

module.exports = db;
