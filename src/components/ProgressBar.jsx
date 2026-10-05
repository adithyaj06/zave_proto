import React from 'react';
import '../styles/ProgressBar.css';

const categories = ['All', 'Food', 'Entertainment', 'Travel', 'Rent', 'Misc'];

const ProgressBar = ({ expenses = [], selectedCategory = 'All', onCategoryChange }) => {
  const totals = categories.reduce((acc, category) => {
    if (category === 'All') return acc;
    acc[category] = 0;
    return acc;
  }, {});

  expenses.forEach((expense) => {
    const category = expense.category || expense.desc || 'Misc';
    if (totals[category] !== undefined) {
      totals[category] += Number(expense.amount) || 0;
    }
  });

  const totalExpenses = Object.values(totals).reduce((sum, amount) => sum + amount, 0);
  const activeTotal = selectedCategory === 'All' ? totalExpenses : (totals[selectedCategory] || 0);
  const percentage = totalExpenses > 0 ? Math.min(100, Math.round((activeTotal / totalExpenses) * 100)) : 0;

  return (
    <div className="expenses-bar-card">
      <div className="expenses-bar-header">
        <div>
          <h4>Expense breakdown</h4>
        </div>
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${percentage}%` }} />
        <span className="progress-label">
          {selectedCategory === 'All' ? 'All categories' : selectedCategory}: ₹{activeTotal.toFixed(2)}
        </span>
      </div>

      <div className="expenses-bar-footer">
        <span>{selectedCategory === 'All' ? 'Showing every category' : ` ${selectedCategory}`}</span>
        <span>₹{activeTotal.toFixed(2)} / ₹{totalExpenses.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
