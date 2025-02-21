const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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

app.get('/', (req, res) => {
  const user = req.session.user || '';
  const group = req.session.group || '';
  const allTasks = req.session.tasks || [];
  const tasks = allTasks.filter(task => task.group === group);
  
  res.render('index', {
    user,
    group,
    tasks,
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
    if (!req.session.tasks) {
      req.session.tasks = [];
    }
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
  
  const task = req.body.task;
  if (task) {
    req.session.tasks = req.session.tasks || [];
    req.session.tasks.push({ text: task, group: req.session.group, done: false });
  }
  res.redirect('/');
});

app.post('/toggletask', (req, res) => {
  const index = parseInt(req.body.index, 10);
  if (req.session.tasks && req.session.tasks[index] !== undefined) {
    req.session.tasks[index].done = !req.session.tasks[index].done;
  }
  res.redirect('/');
});

app.post('/removetask', (req, res) => {
  const index = parseInt(req.body.index, 10);
  if (req.session.tasks && req.session.tasks[index] !== undefined) {
    req.session.tasks.splice(index, 1);
  }
  res.redirect('/');
});

app.get('/random', (req, res) => {
  let randomNumber = req.cookies.randomNumber;
  if (!randomNumber) {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    res.cookie('randomNumber', randomNumber, { maxAge: 24 * 60 * 60 * 1000 }); // 1 dia
  }
  res.send(`Número aleatório: ${randomNumber}`);
});

app.get('/contador', (req, res) => {
  res.send(`
    <p>Contador global: ${globalCounter}</p>
    <p>Contador do usuário: ${req.session.userCounter}</p>
  `);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
