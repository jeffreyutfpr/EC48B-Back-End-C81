const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 * 1. Crie 2 rotas e apresente uma hiperligação (link) em cada uma delas para a outra.
 */
app.get('/rota1', (req, res) => {
  res.send(`
    <h1>Rota 1</h1>
    <p>Vá para <a href="/rota2">Rota 2</a></p>
  `);
});

app.get('/rota2', (req, res) => {
  res.send(`
    <h1>Rota 2</h1>
    <p>Vá para <a href="/rota1">Rota 1</a></p>
  `);
});

/*
 * 2. Crie uma rota que receba um texto por parâmetro GET (query) e exiba o mesmo invertido.
*/
app.get('/reverter', (req, res) => {
  const texto = req.query.texto;
  if (!texto) {
    return res.status(400).send('Parâmetro "texto" é obrigatório.');
  }
  const textoInvertido = texto.split('').reverse().join('');
  res.send(`<h1>Texto Invertido</h1><p>${textoInvertido}</p>`);
});

/*
 * 3. Crie uma rota que receba 2 valores por POST (usuário e senha) e faça a validação.
 * Se a senha for 2 vezes o nome do usuário, exiba uma mensagem de acesso permitido, 
 * caso contrário, informe que não possui permissão.
*/
app.post('/validar', (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) {
    return res.status(400).send('Os campos "usuario" e "senha" são obrigatórios.');
  }

  if (senha === usuario + usuario) {
    res.send(`<h1>Acesso Permitido</h1><p>Usuário: ${usuario}</p>`);
  } else {
    res.send(`<h1>Acesso Negado</h1><p>Usuário: ${usuario}</p>`);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
