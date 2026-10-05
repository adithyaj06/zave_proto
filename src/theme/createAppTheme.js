import { createTheme } from '@mui/material';

// Build the shared Material UI palette and card treatment for the selected mode.
const createAppTheme = (themeMode) => createTheme({
  palette: {
    mode: themeMode,
    primary: { main: themeMode === 'dark' ? '#90caf9' : '#1976d2' },
    background: {
      default: themeMode === 'dark' ? '#121212' : '#f8fafc',
      paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: themeMode === 'dark'
            ? '0 6px 18px rgba(0, 0, 0, 0.28)'
            : '0 6px 18px rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
});

export default createAppTheme;
