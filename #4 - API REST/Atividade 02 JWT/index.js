const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const secretKey = 'minhaChaveSecreta';

function generateRandomMessage() {
  const messages = [
    "Olá, mundo!",
    "Seja bem-vindo!",
    "Hoje é um ótimo dia!",
    "Mantenha a calma e programe!",
    "Você é incrível!"
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

app.get('/generateToken', (req, res) => {
  const message = generateRandomMessage();
  const token = jwt.sign({ message }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/decodeToken', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    res.json({ message: decoded.message });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
