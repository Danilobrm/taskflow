import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // para ler JSON do body
app.use(cors());
app.use(router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
