const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(description, priority, group) {
    this.id = uuidv4(); // Gera um ID único para cada tarefa
    this.description = description;
    this.priority = priority; // "Baixa", "Média" ou "Alta"
    this.completed = false;
    this.group = group; // Para associar a tarefa a um grupo de usuário
  }
}

module.exports = { Task };