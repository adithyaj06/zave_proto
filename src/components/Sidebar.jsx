import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Expenses', path: '/expenses' },
  { label: 'Goals', path: '/goals' },
  { label: 'Challenges', path: '/challenges' },
  { label: 'Rewards', path: '/rewards' },
  { label: 'Profile', path: '/profile' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <nav>
      <ul>
        {navItems.map(({ label, path }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
