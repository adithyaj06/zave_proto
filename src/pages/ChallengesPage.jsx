import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// ChallengesPage: shows weekly missions and current gamification status.
// Weekly challenge UI with the current streak/level summary and custom challenge actions.
const ChallengesPage = ({ gamification, points, level, weeklyChallenges = [], onAddCustomChallenge, onAdvanceCustomChallenge }) => {
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeTarget, setChallengeTarget] = useState('');

  const handleAddChallenge = (event) => {
    event.preventDefault();
    const target = Number(challengeTarget);
    if (!challengeTitle.trim() || !Number.isFinite(target) || target < 1) return;

    onAddCustomChallenge?.({ title: challengeTitle.trim(), target });
    setChallengeTitle('');
    setChallengeTarget('');
  };

  return (
  <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: { xs: 2, sm: 3 } }}>
    <Card elevation={0} sx={{ width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)' }}>
      <CardContent sx={{ p: { xs: 6, md: 7 } }}>
        <Typography variant="h5" fontWeight={500} gutterBottom color="primary.main">
          Challenges
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Keep your streak alive and complete weekly missions to climb the leaderboard.
        </Typography>

        <Stack spacing={2.5}>
          <Card variant="outlined" sx={{ borderRadius: 4, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={500}><LocalFireDepartmentIcon sx={{ verticalAlign: 'middle', mr: 0.5, color: '#f97316' }} />{gamification.streak} day</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight={700}>Level {level}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  {points} XP earned 
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Create a custom challenge
            </Typography>
            <Box component="form" onSubmit={handleAddChallenge} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 2fr) minmax(120px, 1fr) auto' }, gap: 2, alignItems: 'start' }}>
              <TextField 
                label="Challenge name"
                value={challengeTitle}
                onChange={(event) => setChallengeTitle(event.target.value)}
                required
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '18px' } }}
              />
              <TextField
                label="Target steps"
                type="number"
                value={challengeTarget}
                onChange={(event) => setChallengeTarget(event.target.value)}
                inputProps={{ min: 1, step: 1 }}
                required
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '18px' } }}
              />
              <Button type="submit" variant="contained" sx={{ minHeight: 56, borderRadius: '18px' }}>
                Add challenge
              </Button>
            </Box>
          </Card>

          {weeklyChallenges.map((challenge) => {
            const percent = challenge.target > 0
              ? Math.min(100, (challenge.progress / challenge.target) * 100)
              : 0;
            const isStarted = challenge.started ?? challenge.progress > 0;
            return (
              <Card key={challenge.id || challenge.title} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography fontWeight={500}>{challenge.title}</Typography>
                    {challenge.completed ? (
                      <Chip label="Done" color="success" variant="outlined" />
                    ) : (
                      <Chip label={isStarted ? 'In progress' : 'Not started'} variant="outlined" />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {challenge.progress}/{challenge.target} completed
                  </Typography>
                  <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 999 }} />
                  {challenge.isCustom && !challenge.completed && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1.5 }}
                      onClick={() => onAdvanceCustomChallenge?.(challenge.id)}
                    >
                      Log progress
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  </Box>
  );
};

export default ChallengesPage;
