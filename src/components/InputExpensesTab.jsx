import React, { useState } from 'react';
import '../styles/InputExpensesTab.css';

const categories = ['Food', 'Entertainment', 'Travel', 'Rent', 'Misc'];

const InputExpensesTab = ({ onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const expenseAmount = Number(amount);
    const saved = savedAmount === '' ? expenseAmount * 0.3 : Number(savedAmount);

    onAddExpense({ amount: expenseAmount, savedAmount: saved, desc: category, category });
    setAmount('');
    setSavedAmount('');
    setCategory('Food');
  };

  return (
    <form className="input-expenses-tab" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        min="0"
        step="100"
        required
      />

      <input
        type="number"
        placeholder="Saved (optional)"
        aria-label="Saved amount (optional, defaults to 30% of expense)"
        value={savedAmount}
        onChange={(e) => setSavedAmount(e.target.value)}
        min="0"
        step="0.01"
      />

      <select value={category} placeholder="Category" onChange={e => setCategory(e.target.value)} required>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default InputExpensesTab;
