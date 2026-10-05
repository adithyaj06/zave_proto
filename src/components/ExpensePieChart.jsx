import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const categories = ['Food', 'Entertainment', 'Travel', 'Rent', 'Misc'];
const colors = ['#4f46e5', '#ec4899', '#14b8a6', '#f59e0b', '#64748b'];

const polarToCartesian = (cx, cy, r, angle) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

const ExpensePieChart = ({ expenses = [], selectedCategory = 'All' }) => {
  const totals = categories.reduce((acc, category) => ({ ...acc, [category]: 0 }), {});

  expenses.forEach((expense) => {
    const category = expense.category || expense.desc || 'Misc';
    if (totals[category] !== undefined) {
      totals[category] += Number(expense.amount) || 0;
    }
  });

  const isFiltered = selectedCategory !== 'All';
  const selectedValue = isFiltered ? totals[selectedCategory] || 0 : 0;
  const remainingValue = isFiltered
    ? Object.entries(totals).reduce((sum, [category, value]) => sum + (category !== selectedCategory ? value : 0), 0)
    : 0;
  const totalValue = isFiltered ? selectedValue + remainingValue : Object.values(totals).reduce((sum, value) => sum + value, 0);

  if (!totalValue) {
    return (
      <Box className="dark-mode-surface" sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#fff' }}>
        <Typography variant="body2" color="text.secondary">
          Add expenses to see a pie chart by category.
        </Typography>
      </Box>
    );
  }

  const radius = 70;
  const center = 80;
  let startAngle = -90;

  const slices = isFiltered
    ? [
        { category: selectedCategory, value: selectedValue, color: colors[categories.indexOf(selectedCategory) % colors.length] },
        { category: 'Remaining', value: remainingValue, color: '#cbd5e1' },
      ]
        .filter((slice) => slice.value > 0)
        .map((slice) => {
          const angle = (slice.value / totalValue) * 360;
          const endAngle = startAngle + angle;
          const path = describeArc(center, center, radius, startAngle, endAngle);
          startAngle = endAngle;

          return { ...slice, path };
        })
    : categories
        .map((category, index) => {
          const value = totals[category];
          if (!value) return null;

          const angle = (value / totalValue) * 360;
          const endAngle = startAngle + angle;
          const path = describeArc(center, center, radius, startAngle, endAngle);
          startAngle = endAngle;

          return { category, value, path, color: colors[index % colors.length] };
        })
        .filter(Boolean);

  const legendItems = isFiltered
    ? [
        { label: selectedCategory, value: selectedValue, color: colors[categories.indexOf(selectedCategory) % colors.length] },
        { label: 'Total', value: remainingValue, color: '#cbd5e1' },
      ].filter((item) => item.value > 0)
    : categories.map((category, index) => ({
        label: category,
        value: totals[category],
        color: colors[index % colors.length],
      }));

  return (
    <Box className="dark-mode-surface" sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 4, bgcolor: '#fff' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        <svg width="180" height="180" viewBox="0 0 160 160" role="img" aria-label="Expense breakdown pie chart">
          {slices.map((slice) => (
            <path key={slice.category} d={slice.path} fill={slice.color} stroke="#fff" strokeWidth="2" />
          ))}
        </svg>
        <Stack spacing={1} sx={{ width: '100%' }}>
          {legendItems.map((item) => (
            <Box key={item.label} display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="body2">{item.label}</Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                ₹{Number(item.value || 0).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ExpensePieChart;
