import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InputExpensesTab from '../components/InputExpensesTab';

const ExpensesPage = ({ expenses = [], goals = [], onAddExpense, onDeleteExpense, onAddSavingsContribution }) => {
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSavingsSubmit = (event) => {
    event.preventDefault();
    const amount = Number(savingsAmount);
    if (!selectedGoalId || !Number.isFinite(amount) || amount <= 0) return;

    onAddSavingsContribution?.(Number(selectedGoalId), amount);
    setSavingsAmount('');
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: { xs: 2, sm: 3 } }}>
      <Card elevation={0} sx={{ width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={800} gutterBottom color="primary.main">
            Expenses
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Every expense added here is tracked in one place.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <InputExpensesTab onAddExpense={onAddExpense} />
          </Box>

          <Card variant="outlined" sx={{ mb: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Add savings to a bucket
            </Typography>
            {goals.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Create a savings bucket in Goals before adding a contribution.
              </Typography>
            ) : (
              <Box component="form" onSubmit={handleSavingsSubmit}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-start' }}>
                  <TextField
                    select
                    label="Savings bucket"
                    value={selectedGoalId}
                    onChange={(event) => setSelectedGoalId(event.target.value)}
                    SelectProps={{ MenuProps: { PaperProps: { sx: { borderRadius: '8px', mt: 0.5 } } } }}
                    required
                    fullWidth
                  >
                    <MenuItem value="" sx={{ display: 'none' }} />
                    {goals.map((goalItem) => (
                      <MenuItem key={goalItem.id} value={goalItem.id}>{goalItem.title}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Amount saved"
                    type="number"
                    value={savingsAmount}
                    onChange={(event) => setSavingsAmount(event.target.value)}
                    inputProps={{ min: 0.01, step: '0.01' }}
                    required
                    fullWidth
                  />
                  <Button type="submit" variant="contained" sx={{ minWidth: 180, minHeight: 56 }}>
                    Add savings
                  </Button>
                </Stack>
              </Box>
            )}
          </Card>

          <Card variant="outlined" sx={{ mb: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Total spent</Typography>
            <Typography variant="h5" fontWeight={800}>₹{totalSpent.toLocaleString()}</Typography>
          </Card>

          {expenses.length === 0 ? (
            <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <Typography color="text.secondary">No expenses added yet.</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {expenses.map((expense, index) => (
                <React.Fragment key={`${expense.category}-${index}`}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, py: 1 }}>
                    <Stack>
                      <Typography fontWeight={700}>{expense.category || 'General'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {expense.desc || 'Tracked expense'}
                      </Typography>
                      <Typography variant="caption" color="success.dark">
                        Saved ₹{Number(expense.savedAmount ?? (Number(expense.amount) || 0) * 0.3).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={700} color="primary.main">
                        ₹{Number(expense.amount || 0).toLocaleString()}
                      </Typography>
                      <Tooltip title="Delete expense">
                        <IconButton
                          aria-label={`Delete ${expense.category || 'expense'} expense`}
                          color="error"
                          onClick={() => onDeleteExpense?.(index)}
                          size="small"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                  {index < expenses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExpensesPage;
