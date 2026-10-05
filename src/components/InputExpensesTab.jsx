import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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

      <FormControl sx={{ minWidth: 160 }}>
        <Select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          inputProps={{ 'aria-label': 'Category' }}
          MenuProps={{ PaperProps: { sx: { borderRadius: '8px', mt: 0.5 } } }}
          sx={{
            height: 42,
            borderRadius: '10px',
            backgroundColor: '#fff',
            color: '#000',
            fontWeight: 500,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            '& .MuiSelect-select': { padding: '0.7rem 0.8rem' },
          }}
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default InputExpensesTab;
