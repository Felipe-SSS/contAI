import { useState } from 'react';
import { addTransaction } from '../services/api';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';

export default function AddTransaction() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setErrorMessage("O valor deve ser um número positivo.");
      return;
    }

    if (!description || !date) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    const payload = {
      description,
      value,
      type,
      date,
    };

    try {
      await addTransaction(payload);
      setDescription('');
      setAmount('');
      setDate('');
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Erro ao adicionar transação.");
    }
  };

  return (

    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Criar novo lançamento</h1>
        <Link
          to="/transactions"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver lançamentos
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}

        <input
          type="date"
          placeholder="Data"
          value={date.split('T')[0]}
          onChange={e => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Descrição do lançamento"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <NumericFormat
          value={amount}
          onValueChange={(values) => setAmount(values.value)}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          allowNegative={false}
          placeholder="R$ 0,00"
          className="w-full p-2 border rounded"
          decimalScale={2}
          fixedDecimalScale
          required
        />

        <select
          value={type}
          onChange={e => setType(e.target.value as 'credit' | 'debit')}
          className="w-full p-2 border rounded"
        >
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
        </select>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
          Adicionar
        </button>
      </form>
    </div>
  );
}
