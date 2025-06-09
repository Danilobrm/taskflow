import { createServer } from "node:http";
import express from "express";

const app = express();
const port = 3001;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Olá Mundo!");
});

app.listen(port, "localhost", () => {
  console.log("Running on http://localhost:" + port);
});
