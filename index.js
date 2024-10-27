import express from 'express';
import jsonServer from 'json-server';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();
const router = jsonServer.router('./db/db.json');
const middlewares = jsonServer.defaults();

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(middlewares);

// Configuração dos cabeçalhos CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// Integrando o JSON Server com o Express na rota '/api'
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});