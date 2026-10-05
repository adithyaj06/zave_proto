import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import '../styles/Header.css';
import ProfileButton from './ProfileButton';

const Header = ({ themeMode, onThemeChange, user, onProfileClick }) => {
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className={`header ${themeMode}-mode`}>
      <div className="theme-control">
        <time className="header-date" dateTime={new Date().toISOString().split('T')[0]}>{today}</time>
        <ToggleButtonGroup
          value={themeMode}
          exclusive
          onChange={(_, nextMode) => nextMode && onThemeChange(nextMode)}
          size="small"
          aria-label="Color theme"
          className="theme-toggle"
        >
          <ToggleButton value="light" aria-label="Light theme">
            <LightModeIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="dark" aria-label="Dark theme">
            <DarkModeIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    <ProfileButton themeMode={themeMode} user={user} onClick={onProfileClick} />
    </header>
  );
};

export default Header;
