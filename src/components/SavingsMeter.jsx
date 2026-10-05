
import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const SavingsMeter = ({ current = 0, goal = 5000 }) => {
  // Prevent the progress bar from exceeding 100%.
  const percent = Math.min(100, Math.round((current / goal) * 100));
  return (
    <Box className="dark-mode-surface" sx={{
      bgcolor: '#fff',
      border: '1px solid',
      borderColor: 'success.main',
      borderRadius: 4,
      p: 3,
      my: 2,
      boxShadow: 'none',
      minWidth: 250
    }}>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="body1" fontWeight={500}>Saved: ₹{current}</Typography>
        <Typography variant="body1" fontWeight={500}>Goal: ₹{goal}</Typography>
      </Stack>
      <Box sx={{ width: '100%', mb: 1 }}>
        <LinearProgress variant="determinate" value={percent} color="success" sx={{ height: 14, borderRadius: 1 }} />
      </Box>
    </Box>
  );
};

export default SavingsMeter;
