import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from 'react-router-dom';
import { MoreVertical, Trash2, Pencil } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  value: number;
  type: "credit" | "debit";
  date: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  useEffect(() => {
    api.get("/transactions")
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => console.error("Erro ao buscar transações:", err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    }
  };

  const handleConfirmEdit = async (id: number) => {
    try {
      const updated = { ...editData } as Transaction;
      console.log("Payload enviado:", updated);
      await api.put(`/transactions/${id}`, updated);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
      setEditId(null);
      setEditData({});
    } catch (err) {
      console.error("Erro ao editar transação:", err);
    }
  };

  const years = Array.from(new Set(transactions.map(t =>
    new Date(t.date).getFullYear()
  ))).sort((a, b) => b - a);

  const filteredTransactions = transactions.filter(
    (t) => new Date(t.date).getFullYear() === selectedYear
  );

  const groupedByMonth = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString("pt-BR", { month: "long" });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lançamentos</h1>
        <Link
          to="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Criar novo lançamento
        </Link>
      </div>

      <div className="mb-4">
        <label htmlFor="year" className="mr-2 font-medium">Ano:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {Object.entries(groupedByMonth).sort((a, b) => {
        const monthOrder = [
          "janeiro", "fevereiro", "março", "abril", "maio", "junho",
          "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
        return monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]);
      }).map(([month, trans]) => {
        const totalCredit = trans.filter(t => t.type === "credit").reduce((sum, t) => sum + Number(t.value), 0);
        const totalDebit = trans.filter(t => t.type === "debit").reduce((sum, t) => sum + Number(t.value), 0);

        return (
          <div key={month} className="mb-8">
            <h2 className="text-xl font-semibold mb-2 capitalize">{month}</h2>
            <table className="w-full table-fixed border mb-2">
              <thead>
                <tr>
                  <th className="border px-4 py-2 w-28">Data</th>
                  <th className="border px-4 py-2">Descrição</th>
                  <th className="border px-4 py-2">Valor</th>
                  <th className="border px-4 py-2 w-24">Tipo</th>
                  <th className="border px-4 py-2 w-24">Opções</th>
                </tr>
              </thead>
              <tbody>
                {trans.map((t) => (
                  <tr key={t.id} className="relative">
                    {editId === t.id ? (
                      <>
                        <td className="border px-4 py-2">
                          <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className="w-full border px-1 py-1 rounded" />
                        </td>
                        <td className="border px-4 py-2">
                          <input type="text" value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="w-full border px-1 py-1 rounded" />
                        </td>
                        <td className="border px-4 py-2">
                          <input type="number" value={editData.value} onChange={e => setEditData({ ...editData, value: parseFloat(e.target.value) })} className="w-full border px-1 py-1 rounded" />
                        </td>
                        <td className="border px-4 py-2">
                          <select value={editData.type} onChange={e => setEditData({ ...editData, type: e.target.value as "credit" | "debit" })} className="w-full border px-1 py-1 rounded">
                            <option value="credit">Crédito</option>
                            <option value="debit">Débito</option>
                          </select>
                        </td>
                        <td className="border px-4 py-2 flex gap-2">
                          <button onClick={() => handleConfirmEdit(t.id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Confirmar</button>
                          <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">Cancelar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border px-4 py-2">{t.date.split("-").reverse().join("/")}</td>
                        <td className="border px-4 py-2">{t.description}</td>
                        <td className="border px-4 py-2">R$ {Number(t.value).toFixed(2)}</td>
                        <td className="border px-4 py-2 capitalize text-center">{t.type === "credit" ? "Crédito" : "Débito"}</td>
                        <td className="border px-4 py-2 text-center relative">
                          <button onClick={() => setMenuOpenId(menuOpenId === t.id ? null : t.id)}>
                            <MoreVertical size={18} />
                          </button>
                          {menuOpenId === t.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                              <button onClick={() => {
                                setEditId(t.id);
                                setMenuOpenId(null);
                                setEditData(t);
                              }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                                <Pencil size={14} /> Editar
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(t.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={14} /> Apagar
                              </button>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                    {confirmDeleteId === t.id && (
                      <td colSpan={5} className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30">
                        <div className="bg-white p-4 rounded shadow-md text-center">
                          <p className="mb-2">Confirmar exclusão?</p>
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-start gap-4 text-right text-sm text-gray-700">
              <p className="text-green-700 font-medium">Crédito total: R$ {totalCredit.toFixed(2)}</p>
              <p className="text-red-700 font-medium">Débito total: R$ {totalDebit.toFixed(2)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
