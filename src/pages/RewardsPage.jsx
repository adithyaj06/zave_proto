import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

// RewardsPage: displays earned badges and current XP/level summary.
// Props:
// - `earnedBadges`: array of {title, achieved}
// - `points`, `level`, `xpToNextLevel`, `totalSavedAmount`: summary values
const RewardsPage = ({ earnedBadges = [], points = 0, level = 1, xpToNextLevel = 0, totalSavedAmount = 0 }) => (
  <Box sx={{ width: '100%', mx: 'auto', mt: 4, px: { xs: 2, sm: 3 } }}>
    <Card elevation={0} sx={{ width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)' }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight={800} gutterBottom color="primary.main">
          Rewards
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Unlock badges and milestones as you build momentum with every deposit.
        </Typography>

        <Card variant="outlined" sx={{ borderRadius: 4, p: 2, mb: 3 }}>
          
          <Typography variant="h6" fontWeight={700}>Level {level} · {points} XP</Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{totalSavedAmount.toLocaleString()} saved so far · {xpToNextLevel} XP to your next level
          </Typography>
        </Card>

        <Stack spacing={1.5}>
          {earnedBadges.map((badge) => (
            <Card key={badge.title} variant="outlined" sx={{ borderRadius: 4 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Typography fontWeight={500}>{badge.title}</Typography>
                <Chip label={badge.achieved ? 'Unlocked' : 'Locked'} color={badge.achieved ? 'primary' : 'default'} variant={badge.achieved ? 'filled' : 'outlined'} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

export default RewardsPage;
