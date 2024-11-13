import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jsonServer from 'json-server';
import cors from 'cors';

const PORT = 3000;
const app = express();
const router = jsonServer.router('./db/db.json');
const middlewares = jsonServer.defaults();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para JSON e URL encoding
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração CORS
app.use(cors());

// Configuração dos cabeçalhos CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/produtos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'products.html'));
});

app.get('/produto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'product.html'));
});

app.get('/gerenciar-produtos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'products-managment.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'blog.html'));
});

app.get('/post', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'post.html'));
});

app.get('/gerenciar-blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'blog-managment.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'profile.html'));
});

app.get('/gerenciar-usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'users-managment.html'));
});

// Integrando o JSON Server com o Express na rota '/api'
app.use('/api', middlewares, router);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});