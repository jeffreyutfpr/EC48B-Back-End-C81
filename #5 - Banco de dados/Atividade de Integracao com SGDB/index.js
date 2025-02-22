const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error("Erro ao criar tabela tasks:", err.message);
      }
    });
  }
});

app.get('/tasks', (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const tasks = rows.map(task => ({
      ...task,
      completed: task.completed === 1
    }));
    res.json(tasks);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Os campos 'title' e 'description' são obrigatórios." });
  }

  const sql = "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)";
  db.run(sql, [title, description, 0], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, description, completed: false });
  });
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, description, completed } = req.body;

  const sql = "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?";
  db.run(sql, [title, description, completed ? 1 : 0, taskId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.json({ id: taskId, title, description, completed });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.json({ message: "Tarefa excluída com sucesso." });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});