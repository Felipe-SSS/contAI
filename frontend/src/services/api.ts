import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // ajuste para a URL do backend
});

// Função para buscar as transações
export async function fetchTransactions() {
  const response = await api.get("/transactions");
  return response.data;
}

// Função para adicionar uma transação
export async function addTransaction(transaction: {
  description: string;
  value: number;
  type: "credit" | "debit";
  date: string;
}) {
  const response = await api.post("/transactions", transaction);
  return response.data;
}
