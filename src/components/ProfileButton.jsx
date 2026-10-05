import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProfileButton = ({ themeMode, user, onClick }) => (
  <button className="profile-btn" style={{
    background: themeMode === 'dark' ? '#475569' : '#fff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 18,
    cursor: 'pointer',
    position: 'absolute',
    right: 24,
    top: 8
  }}
    aria-label={user ? 'Log out' : 'Log in'}
    title={user ? 'Log out' : 'Log in'}
    onClick={onClick}
  >
    {user ? (
      <ArrowForwardIcon sx={{ color: themeMode === 'dark' ? '#fff' : '#2d3748' }} />
    ) : (
      <PersonIcon sx={{ color: themeMode === 'dark' ? '#fff' : '#2d3748' }} />
    )}
  </button>
);

export default ProfileButton;
