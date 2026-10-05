import { useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import AppRoutes from './AppRoutes';
import LoginDialog from './components/LoginDialog';
import useAppData from './hooks/useAppData';
import useAuthSession from './hooks/useAuthSession';
import createAppTheme from './theme/createAppTheme';

// Compose app-wide state, authentication, theme, and route layout.
function App() {
  const [themeMode, setThemeMode] = useState('light');
  const auth = useAuthSession();
  const data = useAppData();
  const theme = createAppTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!auth.authLoading && auth.user && (
        <AppRoutes
          user={auth.user}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          onLogout={auth.handleLogout}
          data={data}
        />
      )}
      <LoginDialog
        open={!auth.authLoading && !auth.user}
        onClose={() => {}}
        onLogin={auth.handleLogin}
        onRegister={auth.handleRegister}
      />
    </ThemeProvider>
  );
}

export default App;
