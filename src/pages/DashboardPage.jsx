import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DiamondIcon from '@mui/icons-material/Diamond';
import ProgressBar from '../components/ProgressBar';
import SavingsMeter from '../components/SavingsMeter';
import LeaderboardTab from '../components/LeaderboardTab';
import ExpensePieChart from '../components/ExpensePieChart';

const getLocalDateKey = (date) => (
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
);

/**
 * DashboardPage
 * - Shows a gamification snapshot, savings meter, savings buckets, expense inputs,
 *   a pie chart and a simple growth-over-time visualization.
 *
 * Props:
 * - `goal`: global numeric goal value
 * - `goals`: array of savings buckets (id, title, targetAmount, currentSaved)
 * - `expenses`: array of expense objects
 * - `onAddExpense`: callback to add an expense
 * - `gamification`, `points`, `level`, `xpToNextLevel`, `totalSavedAmount`: summary values
 */
const DashboardPage = ({ goal, goals = [], expenses, savingsContributions = [], gamification, points, level, xpToNextLevel, leaderboardEntries = [] }) => {
  // Local UI state: which category is selected for charts/bars
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeRange, setTimeRange] = useState('month');
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12
    ? 'Good morning'
    : currentHour < 17
      ? 'Good afternoon'
      : currentHour < 21
        ? 'Good evening'
        : 'Good night';

  // Keep spending and saved amounts separate in the dashboard summary.
  const savings = expenses.reduce((sum, expense) => (
    sum + (Number(expense.savedAmount ?? (Number(expense.amount) || 0) * 0.3) || 0)
  ), 0);

  const today = new Date();
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const periodBuckets = timeRange === 'week'
    ? Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + index);
        return { key: getLocalDateKey(date), label: date.toLocaleDateString(undefined, { weekday: 'short' }) };
      })
    : timeRange === 'month'
      ? Array.from({ length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() }, (_, index) => {
          const date = new Date(today.getFullYear(), today.getMonth(), index + 1);
          return { key: getLocalDateKey(date), label: String(index + 1) };
        })
      : Array.from({ length: 12 }, (_, index) => ({
          key: `${today.getFullYear()}-${String(index + 1).padStart(2, '0')}`,
          label: new Date(today.getFullYear(), index, 1).toLocaleDateString(undefined, { month: 'short' }),
        }));
  const savingsEvents = [
    ...expenses.map((expense) => ({
      date: expense.date,
      amount: Number(expense.savedAmount ?? (Number(expense.amount) || 0) * 0.3) || 0,
    })),
    ...savingsContributions,
  ];
  const savingsByPeriod = savingsEvents.reduce((totals, event) => {
    if (!event.date) return totals;
    const date = new Date(`${event.date}T00:00:00`);
    if (Number.isNaN(date.getTime())) return totals;
    const key = timeRange === 'year'
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : getLocalDateKey(date);
    const saved = Number(event.amount) || 0;
    totals.set(key, (totals.get(key) || 0) + saved);
    return totals;
  }, new Map());
  let runningSavings = 0;
  const growthValues = periodBuckets.map(({ key }) => {
    runningSavings += savingsByPeriod.get(key) || 0;
    return runningSavings;
  });
  const growthMax = Math.max(...growthValues, 1);
  const growthPoints = growthValues
    .map((value, index) => {
      const x = 24 + (index / Math.max(growthValues.length - 1, 1)) * 552;
      const y = 124 - (value / growthMax) * 92;
      return `${x},${y}`;
    })
    .join(' ');
  const growthLabelIndexes = [...new Set([
    0,
    Math.floor((periodBuckets.length - 1) / 4),
    Math.floor((periodBuckets.length - 1) / 2),
    Math.floor(((periodBuckets.length - 1) * 3) / 4),
    periodBuckets.length - 1,
  ])];
  const hasPeriodSavings = growthValues.some((value) => value > 0);

  const medalTiers = [
    { name: 'Bronze', icon: EmojiEventsIcon, color: '#b87333', minLevel: 1 },
    { name: 'Silver', icon: EmojiEventsIcon, color: '#c0c0c0', minLevel: 10 },
    { name: 'Gold', icon: EmojiEventsIcon, color: '#d4af37', minLevel: 30 },
    { name: 'Diamond', icon: DiamondIcon, color: '#5eead4', minLevel: 50 },
  ];

  const currentMedalIndex = medalTiers.reduce((index, tier, idx) => (level >= tier.minLevel ? idx : index), 0);
  const currentMedal = medalTiers[currentMedalIndex];

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: { xs: 2, sm: 3 } }}>
      <Card elevation={0} sx={{ mb: 3, borderRadius: 4, overflow: 'hidden', width: '100%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={300} sx={{ mb: 3 }}>
            {greeting}
          </Typography>
          <Box className="dark-mode-surface" sx={{ mb: 3, p: 2.5, borderRadius: 3, background: 'linear-gradient(135deg, #eef6ff 0%, #f8fbff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', letterSpacing: 1.2 }}>
                Tier
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {currentMedal.name}
              </Typography>
            </Box>
            <Box
              className="dark-mode-surface"
              sx={{
                width: 82,
                height: 82,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${currentMedal.color}33 0%, #ffffff 100%)`,
                border: `3px solid ${currentMedal.color}`,
                boxShadow: `0 0 0 6px ${currentMedal.color}20`
              }}
            >
              <currentMedal.icon sx={{ fontSize: 48, color: currentMedal.color }} />
            </Box>
          </Box>
          <Stack spacing={2.5}>
            <Card variant="outlined" sx={{ borderRadius: 4, p: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  
                  <Typography variant="h6" fontWeight={700}>
                    <LocalFireDepartmentIcon sx={{ verticalAlign: 'middle', mr: 0.5, color: '#f97316' }} />
                    {gamification.streak} day streak
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {points} XP earned · {xpToNextLevel} XP to level {level + 1}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, ((points % 1000) / 1000) * 100)}
                    sx={{ width: 'calc(100% - 24px)', mx: 'auto', height: 6, borderRadius: 999 }}
                  />
                </Box>
                <Box
                  className="dark-mode-surface"
                  sx={{
                    minWidth: 110,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
                    border: '1px solid #dbeafe',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" color="text.secondary">Level</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2 }}>{level}</Typography>
                </Box>
              </Box>
            </Card>
            <SavingsMeter current={savings} goal={goal} />
            {/* Savings Buckets */}
            <Card variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                 Buckets
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
                {goals.map((g) => {
                  const target = Number(g.targetAmount || 0);
                  const saved = Number(g.currentSaved || 0);
                  const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;

                  return (
                    <Card key={g.id} variant="outlined" sx={{ minWidth: 0, flex: '1 1 180px', borderRadius: 4, p: 2 }}>
                      <Typography fontWeight={500}>{g.title}</Typography>
                      <Typography variant="caption" color="text.secondary">Saved ₹{saved.toLocaleString()} of ₹{target.toLocaleString()}</Typography>
                      <LinearProgress variant="determinate" value={pct} sx={{ width: 'calc(100% - 24px)', mx: 'auto', height: 6, borderRadius: 999, mt: 1.5 }} />
                    </Card>
                  );
                })}
              </Stack>
            </Card>
            <ProgressBar expenses={expenses} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            <ExpensePieChart expenses={expenses} selectedCategory={selectedCategory} />

            {/* Growth Over Time */}
            <Card variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  My Progress
                </Typography>
                <Select
                  value={timeRange}
                  onChange={(event) => setTimeRange(event.target.value)}
                  inputProps={{ 'aria-label': 'Progress duration' }}
                  MenuProps={{ PaperProps: { sx: { borderRadius: '8px', mt: 0.5 } } }}
                  sx={{
                    minWidth: 104,
                    height: 34,
                    borderRadius: 1.5,
                    border: '1px solid #dbeafe',
                    backgroundColor: '#fff',
                    color: 'text.primary',
                    fontSize: 14,
                    '& .MuiOutlinedInput-notchedOutline': { border: 0 },
                    '& .MuiSelect-select': { py: 0.75, pl: 1.5, pr: '2rem' },
                  }}
                >
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                  <MenuItem value="year">Yearly</MenuItem>
                </Select>
              </Box>
              <Box sx={{ width: '100%' }}>
                <svg viewBox="0 0 600 150" width="100%" height="150" role="img" aria-label="Savings progress line graph" preserveAspectRatio="none">
                  {[32, 78, 124].map((y) => (
                    <line key={y} x1="24" x2="576" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" />
                  ))}
                  {hasPeriodSavings && (
                    <polyline
                      points={growthPoints}
                      fill="none"
                      stroke="#1976d2"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1.5 }}>
                  {growthLabelIndexes.map((index) => (
                    <Typography key={periodBuckets[index].key} variant="caption" color="text.secondary">
                      {periodBuckets[index].label}
                    </Typography>
                  ))}
                </Box>
                {!hasPeriodSavings && (
                  <Typography variant="caption" color="text.secondary">
                    No saved expense data for this period.
                  </Typography>
                )}
              </Box>
            </Card>
            <LeaderboardTab entries={leaderboardEntries} />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;
