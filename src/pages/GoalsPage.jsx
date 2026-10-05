import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SavingsIcon from '@mui/icons-material/Savings';
import DiamondIcon from '@mui/icons-material/Diamond';
import BlockIcon from '@mui/icons-material/Block';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const defaultFormValues = {
  title: '',
  targetAmount: '',
  currentSaved: '',
};

const GoalsPage = ({ goal, setGoal, goals = [], onAddGoal, earnedBadges = [], gamification, points, level, xpToNextLevel, totalSavedAmount }) => {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [draftGoal, setDraftGoal] = useState(goal);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formValues.title.trim() || !formValues.targetAmount) return;

    const newGoal = {
      id: Date.now(),
      title: formValues.title.trim(),
      targetAmount: Number(formValues.targetAmount),
      currentSaved: Number(formValues.currentSaved || 0),
    };

    onAddGoal?.(newGoal);
    setFormValues(defaultFormValues);
  };

  const handleSaveGoal = () => {
    const numericGoal = Number(draftGoal);
    if (!Number.isNaN(numericGoal) && numericGoal > 0) setGoal(numericGoal);
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: { xs: 2, sm: 3 } }}>
      <Card elevation={0} sx={{ width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={800} gutterBottom color="primary.main">
            Goals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create saving goals and track how close you are to reaching each target.
          </Typography>

          <Card variant="outlined" sx={{ mb: 3, borderRadius: 4, p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>

                <Typography fontWeight={500}><LocalFireDepartmentIcon sx={{ verticalAlign: 'middle', mr: 0.5, color: '#f97316' }} />{gamification.streak} day</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700}>Level {level} · {points} XP</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={500}>₹{totalSavedAmount.toLocaleString()} Saved</Typography>
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {xpToNextLevel} XP to your next level
            </Typography>
          </Card>

          <Card variant="outlined" sx={{ mb: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Achievements
            </Typography>
            <Box sx={{ width: '100%', pb: 0.5 }}>
              <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
              {earnedBadges.map((badge) => {
                const BadgeIcon = {
                  '₹1,000 Saved': SavingsIcon,
                  '₹10,000 Saved': DiamondIcon,
                  'No-Spend Warrior': BlockIcon,
                  'Goal Crusher': TrackChangesIcon,
                  'Consistency Champion': ShowChartIcon,
                  'The Wealth Architect': EmojiEventsIcon,
                }[badge.title] || SavingsIcon;

                return (
                  <Tooltip
                    key={badge.title}
                    arrow
                    title={`${badge.description} ${badge.achieved ? 'Unlocked' : 'Locked'}`}
                  >
                    <Card
                      variant="outlined"
                      sx={{ flex: '1 1 0', minWidth: 0, minHeight: 118, borderRadius: 3, cursor: 'help' }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: 1.25, '&:last-child': { pb: 1.25 } }}>
                        <BadgeIcon color={badge.achieved ? 'primary' : 'disabled'} />
                        <Typography variant="caption" fontWeight={500} textAlign="center" sx={{ lineHeight: 1.2 }}>
                          {badge.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={badge.tier || (badge.achieved ? 'Unlocked' : 'Locked')}
                          color={badge.achieved ? 'success' : 'default'}
                          variant={badge.achieved ? 'filled' : 'outlined'}
                        />
                      </CardContent>
                    </Card>
                  </Tooltip>
                );
              })}
              </Stack>
            </Box>
          </Card>

          <Card variant="outlined" sx={{ mb: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Add a new savings bucket
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="Goal name"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                required
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Target amount"
                  name="targetAmount"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={formValues.targetAmount}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Saved so far"
                  name="currentSaved"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formValues.currentSaved}
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', borderRadius: 3 }}>
                Add goal
              </Button>
            </Box>
          </Card>

          <Card variant="outlined" sx={{ mb: 3, borderRadius: 3, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
             Total savings goal
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-start' }}>
              <TextField
                label="Dashboard savings"
                type="number"
                value={draftGoal}
                onChange={(event) => setDraftGoal(event.target.value)}
                inputProps={{ min: 1 }}
                fullWidth
              />
              <Button variant="contained" onClick={handleSaveGoal} sx={{ minWidth: 140, borderRadius: 3 }}>
                Save goal
              </Button>
            </Stack>
          </Card>

          {goals.length === 0 ? (
            <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <Typography color="text.secondary">No goals added yet.</Typography>
            </Box>
          ) : (
            <Stack spacing={2.5}>
              {goals.map((goal) => {
                const target = Number(goal.targetAmount || 0);
                const saved = Number(goal.currentSaved || 0);
                const progress = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
                const remaining = Math.max(0, target - saved);

                return (
                    <Card key={goal.id} variant="outlined" sx={{ borderRadius: 4 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography fontWeight={700}>{goal.title}</Typography>
                        <Chip label={`${progress.toFixed(0)}%`} color="primary" variant="outlined" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Saved ₹{saved.toLocaleString()} of ₹{target.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 10,
                          borderRadius: 999,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #4f46e5 0%, #22c55e 100%)',
                          },
                        }}
                      />
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" sx={{ mt: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress: {progress.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Remaining: ₹{remaining.toLocaleString()}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default GoalsPage;
