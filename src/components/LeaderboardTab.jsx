import React from 'react';
import '../styles/LeaderboardTab.css';

const LeaderboardTab = ({ entries = [] }) => {
  const topEntries = [...entries]
    .sort((first, second) => second.savings - first.savings)
    .slice(0, 3);

  return (
  <div className="leaderboard-tab">
    <h3>Top 3 this week</h3>
    {topEntries.length === 0 ? (
      <p>No leaderboard entries yet.</p>
    ) : (
      <ol>
      {topEntries.map((user, idx) => (
        <li key={user.id || user.name} className={user.name === 'You' ? 'me' : ''}>
          <span className="name-group">
            <span className="rank">{idx + 1}</span>
            <span>{user.name}</span>
          </span>
          <span>₹{user.savings.toLocaleString()}</span>
        </li>
      ))}
      </ol>
    )}
  </div>
  );
};

export default LeaderboardTab;
