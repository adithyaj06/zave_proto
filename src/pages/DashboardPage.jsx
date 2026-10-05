import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DiamondIcon from '@mui/icons-material/Diamond';
import ProgressBar from '../components/ProgressBar';
import SavingsMeter from '../components/SavingsMeter';
import LeaderboardTab from '../components/LeaderboardTab';
import ExpensePieChart from '../components/ExpensePieChart';

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
const DashboardPage = ({ goal, goals = [], expenses, gamification, points, level, xpToNextLevel, leaderboardEntries = [] }) => {
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

  // Static growth-over-time datasets used for the chart below.
  // Replace these with real time-series data when a backend/history source is available.
  const growthData = {
    week: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      values: [4200, 4240, 4215, 4280, 4310, 4345],
    },
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [9600, 9720, 9685, 9810, 9890, 9975],
    },
    year: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      values: [32000, 32400, 32250, 32800, 33150, 33500],
    },
  };

  const growth = growthData[timeRange];
  const growthMin = Math.min(...growth.values);
  const growthMax = Math.max(...growth.values);
  const growthRange = growthMax - growthMin || 1;
  const growthPoints = growth.values
    .map((value, index) => {
      const x = 24 + (index / (growth.values.length - 1)) * 552;
      const y = 124 - ((value - growthMin) / growthRange) * 92;
      return `${x},${y}`;
    })
    .join(' ');

  const medalTiers = [
    { name: 'Bronze', icon: EmojiEventsIcon, color: '#b87333', minLevel: 1 },
    { name: 'Silver', icon: EmojiEventsIcon, color: '#c0c0c0', minLevel: 10 },
    { name: 'Gold', icon: EmojiEventsIcon, color: '#d4af37', minLevel: 20 },
    { name: 'Diamond', icon: DiamondIcon, color: '#5eead4', minLevel: 30 },
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
                    sx={{ width: '82%', marginLeft: '2%', height: 6, borderRadius: 999, maxWidth: '100%' }}
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
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                 Buckets
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
                {goals.map((g) => {
                  const target = Number(g.targetAmount || 0);
                  const saved = Number(g.currentSaved || 0);
                  const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;

                  return (
                    <Card key={g.id} variant="outlined" sx={{ minWidth: 0, flex: '1 1 180px', borderRadius: 4, p: 2 }}>
                      <Typography fontWeight={700}>{g.title}</Typography>
                      <Typography variant="caption" color="text.secondary">Saved ₹{saved.toLocaleString()} of ₹{target.toLocaleString()}</Typography>
                      <LinearProgress variant="determinate" value={pct} sx={{ width: '82%', marginLeft: '2%', height: 6, borderRadius: 999, mt: 1.5, maxWidth: '100%' }} />
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
                <Box component="select" value={timeRange} onChange={(event) => setTimeRange(event.target.value)} sx={{ border: '1px solid #dbeafe', borderRadius: 1.5, px: 1.5, py: 0.75, fontSize: 14, background: '#fff', color: 'text.primary' }}>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </Box>
              </Box>
              <Box sx={{ width: '100%' }}>
                <svg viewBox="0 0 600 150" width="100%" height="150" role="img" aria-label="Savings progress line graph" preserveAspectRatio="none">
                  {[32, 78, 124].map((y) => (
                    <line key={y} x1="24" x2="576" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" />
                  ))}
                  <polyline
                    points={growthPoints}
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {growth.values.map((value, index) => {
                    const [cx, cy] = growthPoints.split(' ')[index].split(',');
                    return <circle key={value} cx={cx} cy={cy} r="5" fill="#fff" stroke="#1976d2" strokeWidth="3" />;
                  })}
                </svg>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1.5 }}>
                  {growth.labels.map((label) => (
                    <Typography key={label} variant="caption" color="text.secondary">{label}</Typography>
                  ))}
                </Box>
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
