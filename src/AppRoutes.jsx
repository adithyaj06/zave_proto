import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ChallengesPage from './pages/ChallengesPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import GoalsPage from './pages/GoalsPage';

// Keep page routing and shared layout separate from app state.
const AppRoutes = ({ themeMode, onThemeChange, data }) => (
  <BrowserRouter>
    <div className={`app-layout ${themeMode}-mode`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Header
        themeMode={themeMode}
        onThemeChange={onThemeChange}
      />
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={(
              <DashboardPage
                goal={data.goal}
                goals={data.goals}
                expenses={data.expenses}
                savingsContributions={data.savingsContributions}
                onAddExpense={data.handleAddExpense}
                gamification={data.gamification}
                points={data.points}
                level={data.level}
                xpToNextLevel={data.xpToNextLevel}
                totalSavedAmount={data.totalSavedAmount}
                leaderboardEntries={data.leaderboardEntries}
              />
            )} />
            <Route path="/expenses" element={(
              <ExpensesPage
                expenses={data.expenses}
                goals={data.goals}
                onAddExpense={data.handleAddExpense}
                onDeleteExpense={data.handleDeleteExpense}
                onAddSavingsContribution={data.handleAddSavingsContribution}
              />
            )} />
            <Route path="/goals" element={(
              <GoalsPage
                goal={data.goal}
                setGoal={data.setGoal}
                goals={data.goals}
                onAddGoal={data.handleAddGoal}
                earnedBadges={data.earnedBadges}
                gamification={data.gamification}
                points={data.points}
                level={data.level}
                xpToNextLevel={data.xpToNextLevel}
                totalSavedAmount={data.totalSavedAmount}
              />
            )} />
            <Route path="/challenges" element={(
              <ChallengesPage
                gamification={data.gamification}
                points={data.points}
                level={data.level}
                weeklyChallenges={data.weeklyChallenges}
                onAddCustomChallenge={data.handleAddCustomChallenge}
                onAdvanceCustomChallenge={data.handleAdvanceCustomChallenge}
              />
            )} />
            <Route path="/rewards" element={(
              <RewardsPage
                earnedBadges={data.earnedBadges}
                points={data.points}
                level={data.level}
                xpToNextLevel={data.xpToNextLevel}
                totalSavedAmount={data.totalSavedAmount}
              />
            )} />
            <Route path="/profile" element={(
              <ProfilePage
                entries={data.leaderboardEntries}
                onAddLeaderboardEntry={data.handleAddLeaderboardEntry}
                onDeleteLeaderboardEntry={data.handleDeleteLeaderboardEntry}
                points={data.points}
                xpToNextLevel={data.xpToNextLevel}
                totalSavedAmount={data.totalSavedAmount}
              />
            )} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  </BrowserRouter>
);

export default AppRoutes;
