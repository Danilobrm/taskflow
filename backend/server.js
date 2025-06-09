
import { createServer } from 'node:http';
import express from "express"

const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Olá Mundo!')
})

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(port, 'localhost', () => {
  console.log('Running onn http://localhost:' + port);
});

