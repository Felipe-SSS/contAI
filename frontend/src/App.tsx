import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* By default, the system will always start in /add (not a problem, there's no landing page) */}
        <Route path="/" element={<Navigate to="/add" />} />

        {/* Create new transaction */}
        <Route path="/add" element={<AddTransaction />} />

        {/* View all transactions by year and month */}
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}