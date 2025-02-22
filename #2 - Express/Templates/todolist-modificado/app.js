const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const { Task } = require('./model/Tasks');

const app = express();
const port = 3000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'minhaChaveSecreta',
  resave: false,
  saveUninitialized: true
}));

let globalCounter = 0;
app.use((req, res, next) => {
  globalCounter++;
  req.session.userCounter = (req.session.userCounter || 0) + 1;
  next();
});

let tasks = [];

app.get('/', (req, res) => {
  const user = req.session.user || '';
  const group = req.session.group || '';
  const filteredTasks = group ? tasks.filter(task => task.group === group) : tasks;
  res.render('index', {
    user,
    group,
    tasks: filteredTasks,
    isAuthenticated: !!req.session.user,
    globalCounter,
    userCounter: req.session.userCounter
  });
});

app.post('/salvauser', (req, res) => {
  const { usuario, senha, grupo } = req.body;
  if (!usuario || !senha || !grupo) {
    return res.status(400).send('Os campos "usuário", "senha" e "grupo" são obrigatórios.');
  }
  if (senha === usuario + usuario) {
    req.session.user = usuario;
    req.session.group = grupo;
    res.redirect('/');
  } else {
    res.send(`<h1>Acesso Negado</h1><p>Usuário: ${usuario}</p><p><a href="/">Voltar</a></p>`);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/addtask', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  
  const { task, priority } = req.body;
  if (task && priority) {
    const newTask = new Task(task, priority, req.session.group);
    tasks.push(newTask);
  }
  res.redirect('/');
});

app.get('/complete/:id', (req, res) => {
  const taskId = req.params.id;
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });
  res.redirect('/');
});

app.post('/removetask', (req, res) => {
  const id = req.body.id;
  tasks = tasks.filter(task => task.id !== id);
  res.redirect('/');
});

app.get('/list', (req, res) => {
  const sortedTasks = [...tasks].sort((a, b) => a.description.localeCompare(b.description));
  res.render('list', { tasks: sortedTasks });
});

app.get('/stats', (req, res) => {
  res.render('stats', { totalTasks: tasks.length });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});