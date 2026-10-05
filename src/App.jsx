import { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import AppRoutes from './AppRoutes';
import useAppData from './hooks/useAppData';
import createAppTheme from './theme/createAppTheme';

// Compose the shared app data, theme, and frontend routes.
function App() {
  const [themeMode, setThemeMode] = useState('light');
  const data = useAppData();
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes
        themeMode={themeMode}
        onThemeChange={setThemeMode}
        data={data}
      />
    </ThemeProvider>
  );
}

export default App;
