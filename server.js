const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./tarefas.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// Criação da tabela Tarefas, se não existir
db.run(`CREATE TABLE IF NOT EXISTS Tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  custo REAL NOT NULL,
  data_limite TEXT NOT NULL,
  ordem INTEGER NOT NULL UNIQUE
)`);

// Listar Tarefas
app.get('/tarefas', (req, res) => {
  db.all('SELECT * FROM Tarefas ORDER BY ordem', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Adicionar Tarefa
app.post('/tarefas', (req, res) => {
  const { nome, custo, data_limite } = req.body;
  db.get('SELECT MAX(ordem) AS max_ordem FROM Tarefas', (err, row) => {
    if (err) return res.status(500).send(err.message);

    const ordem = (row.max_ordem || 0) + 1;
    const query = `INSERT INTO Tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, ?)`;

    db.run(query, [nome, custo, data_limite, ordem], function (err) {
      if (err) return res.status(400).json({ error: 'Nome já existente' });
      res.json({ id: this.lastID });
    });
  });
});

// Editar Tarefa
app.put('/tarefas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;

  const query = `UPDATE Tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?`;
  db.run(query, [nome, custo, data_limite, id], function (err) {
    if (err) return res.status(400).json({ error: 'Nome já existente' });
    res.json({ success: true });
  });
});

// Excluir Tarefa
app.delete('/tarefas/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM Tarefas WHERE id = ?`, id, (err) => {
    if (err) return res.status(500).send(err.message);
    res.json({ success: true });
  });
});

// Porta do Servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
