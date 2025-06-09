export type TransactionType = "credit" | "debit";

export interface Transaction {
  id: number;
  description: string;
  value: number;
  type: TransactionType;
  date: string;
}

export interface TransactionSummary {
  month: string;
  transactions: Transaction[];
  totalCredit: number;
  totalDebit: number;
}
