import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfilePage = ({ entries = [], onAddLeaderboardEntry, onDeleteLeaderboardEntry, points = 0, xpToNextLevel = 100, totalSavedAmount = 0 }) => {
  const [leaderboardForm, setLeaderboardForm] = useState({ name: '', savings: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!leaderboardForm.name.trim() || !leaderboardForm.savings) return;

    onAddLeaderboardEntry?.({
      name: leaderboardForm.name.trim(),
      savings: Number(leaderboardForm.savings),
    });
    setLeaderboardForm({ name: '', savings: '' });
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: { xs: 2, sm: 3 } }}>
      <Card elevation={3} sx={{ width: '100%', borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary.main">
            Profile
          </Typography>
          <Card variant="outlined" sx={{ mt: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="h6" fontWeight={800}>
            {points.toLocaleString()} XP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {xpToNextLevel.toLocaleString()} XP to the next level
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Earn 10 XP for every ₹100 saved. Every 100 XP advances you to the next level.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Current savings: ₹{totalSavedAmount.toLocaleString()}
            </Typography>
          </Card>
          <Card variant="outlined" sx={{ mt: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Add to this week&apos;s leaderboard
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  value={leaderboardForm.name}
                  onChange={(event) => setLeaderboardForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label="Amount saved"
                  type="number"
                  value={leaderboardForm.savings}
                  onChange={(event) => setLeaderboardForm((prev) => ({ ...prev, savings: event.target.value }))}
                  inputProps={{ min: 0 }}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', borderRadius: 3 }}>
                  Add to leaderboard
                </Button>
              </Stack>
            </Box>
          </Card>
          <Card variant="outlined" sx={{ mt: 3, borderRadius: 4, p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Added leaderboard names
            </Typography>
            {entries.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No names added yet.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {entries.map((entry) => (
                  <Box
                    key={entry.id}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: 1, borderRadius: 2, bgcolor: 'action.hover' }}
                  >
                    <Box>
                      <Typography fontWeight={600}>{entry.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{Number(entry.savings).toLocaleString()} saved
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      aria-label={`Delete ${entry.name}`}
                      title={`Delete ${entry.name}`}
                      onClick={() => onDeleteLeaderboardEntry?.(entry.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
