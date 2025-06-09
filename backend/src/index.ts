import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import transactionRoutes from "./routes/transactionRoutes";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/transactions", transactionRoutes);

AppDataSource.initialize().then(() => {
  console.log("📦 Conectado ao banco de dados!");
  app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
  });
});
