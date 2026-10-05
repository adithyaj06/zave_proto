import { useEffect, useState } from 'react';
import { readStoredArray } from '../utils/browserStorage';
import { getDateKey, getMonthKey, getMonthWeekKeys, getNextStreak, getWeekStartKey } from '../utils/appDates';

const initialGamification = {
  streak: 1,
  maxStreak: 1,
  totalDeposits: 0,
  lastDepositDate: null,
};

// Own shared savings, expense, challenge, leaderboard, and achievement data.
const useAppData = () => {
  const [goal, setGoal] = useState(5000);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [gamification, setGamification] = useState(initialGamification);

  // Persist challenge history used by monthly achievement checks and custom challenges.
  const [completedChallengeWeeks, setCompletedChallengeWeeks] = useState(() => readStoredArray('zave-completed-challenge-weeks'));
  const [customChallenges, setCustomChallenges] = useState(() => readStoredArray('zave-custom-challenges'));

  useEffect(() => {
    localStorage.setItem('zave-completed-challenge-weeks', JSON.stringify(completedChallengeWeeks));
    localStorage.setItem('zave-custom-challenges', JSON.stringify(customChallenges));
  }, [completedChallengeWeeks, customChallenges]);

  // Savings totals include goal balances and the saved portion of each expense.
  const totalSavedAmount = goals.reduce((sum, savingsGoal) => (
    sum + (Number(savingsGoal.currentSaved) || 0)
  ), 0) + expenses.reduce((sum, expense) => (
    sum + (Number(expense.savedAmount ?? (Number(expense.amount) || 0) * 0.3) || 0)
  ), 0);

  // Award 10 XP per complete ₹100 saved, with 100 XP required for each level.
  const points = Math.floor(totalSavedAmount / 100) * 10;
  const level = Math.floor(points / 100) + 1;
  const xpToNextLevel = 100 - (points % 100);

  // Derive period-specific values once so pages and handlers share the same calendar boundaries.
  const currentMonthKey = getMonthKey();
  const currentWeekKey = getWeekStartKey();
  const currentWeekDeposits = expenses.filter((expense) => (
    expense.date && getWeekStartKey(new Date(`${expense.date}T00:00:00`)) === currentWeekKey
  )).length;
  const monthChallengeWeeks = getMonthWeekKeys(currentMonthKey);
  const completedAllMonthlyChallenges = monthChallengeWeeks.length > 0
    && monthChallengeWeeks.every((weekKey) => completedChallengeWeeks.includes(weekKey));
  const savingsGoalProgress = goal > 0 ? totalSavedAmount / goal : 0;

  const earnedBadges = [
    { title: '₹1,000 Saved', description: 'Save at least ₹1,000.', achieved: totalSavedAmount >= 1000 },
    { title: '₹10,000 Saved', description: 'Save at least ₹10,000.', achieved: totalSavedAmount >= 10000 },
    { title: 'No-Spend Warrior', description: 'Save at least ₹1,000 without recording expenses.', achieved: expenses.length === 0 && totalSavedAmount >= 1000 },
    { title: 'Goal Crusher', description: 'Reach the target on any savings goal.', achieved: goals.some((savingsGoal) => Number(savingsGoal.targetAmount) > 0 && Number(savingsGoal.currentSaved) >= Number(savingsGoal.targetAmount)) },
    { title: 'Consistency Champion', description: 'Maintain a 7-day savings streak.', achieved: gamification.streak >= 7 },
    {
      title: 'The Wealth Architect',
      description: 'Maintain a 30-day streak, complete every weekly challenge in a month, and reach at least 80% of your savings goal.',
      achieved: gamification.streak >= 30 && completedAllMonthlyChallenges && savingsGoalProgress >= 0.8,
    },
  ];

  const weeklyChallenges = [
    { title: 'Save 3 times this week', target: 3, progress: Math.min(currentWeekDeposits, 3), started: currentWeekDeposits > 0, completed: currentWeekDeposits >= 3 },
    { title: 'Hold a 3-day streak', target: 3, progress: Math.min(gamification.streak, 3), started: gamification.totalDeposits > 0, completed: gamification.streak >= 3 && gamification.totalDeposits > 0 },
    { title: 'Log 5 savings deposits this week', target: 5, progress: Math.min(currentWeekDeposits, 5), started: currentWeekDeposits > 0, completed: currentWeekDeposits >= 5 },
    { title: 'Maintain a 7-day streak', target: 7, progress: Math.min(gamification.streak, 7), started: gamification.totalDeposits > 0, completed: gamification.streak >= 7 && gamification.totalDeposits > 0 },
    { title: 'Reach ₹10,000 saved', target: 10000, progress: Math.min(totalSavedAmount, 10000), started: totalSavedAmount > 0, completed: totalSavedAmount >= 10000 },
    ...customChallenges,
  ];

  const handleAddExpense = (expense) => {
    const today = getDateKey();
    const expenseWithDate = { ...expense, date: today };
    setExpenses((previous) => [...previous, expenseWithDate]);

    const nextWeekDepositCount = currentWeekDeposits + 1;
    const nextStreak = getNextStreak(gamification, today);
    setGamification((previous) => ({
      ...previous,
      streak: nextStreak,
      maxStreak: Math.max(previous.maxStreak, nextStreak),
      totalDeposits: previous.totalDeposits + 1,
      lastDepositDate: today,
    }));

    if (nextWeekDepositCount >= 3 && nextStreak >= 3) {
      setCompletedChallengeWeeks((previous) => (
        previous.includes(currentWeekKey) ? previous : [...previous, currentWeekKey]
      ));
    }
  };

  const handleAddCustomChallenge = (challenge) => {
    setCustomChallenges((previous) => [
      ...previous,
      { ...challenge, id: Date.now(), progress: 0, started: false, completed: false, isCustom: true },
    ]);
  };

  const handleAdvanceCustomChallenge = (challengeId) => {
    setCustomChallenges((previous) => previous.map((challenge) => {
      if (challenge.id !== challengeId) return challenge;
      const progress = Math.min(challenge.target, challenge.progress + 1);
      return { ...challenge, progress, started: true, completed: progress >= challenge.target };
    }));
  };

  const handleAddGoal = (newGoal) => {
    setGoals((previous) => [...previous, newGoal]);
  };

  const handleAddSavingsContribution = (goalId, amount) => {
    setGoals((previous) => previous.map((savingsGoal) => (
      savingsGoal.id === goalId
        ? { ...savingsGoal, currentSaved: (Number(savingsGoal.currentSaved) || 0) + amount }
        : savingsGoal
    )));

    const today = getDateKey();
    const nextStreak = getNextStreak(gamification, today);
    setGamification((previous) => ({
      ...previous,
      streak: nextStreak,
      maxStreak: Math.max(previous.maxStreak, nextStreak),
      totalDeposits: previous.totalDeposits + 1,
      lastDepositDate: today,
    }));
  };

  const handleAddLeaderboardEntry = (entry) => {
    setLeaderboardEntries((previous) => [...previous, { ...entry, id: Date.now() }]);
  };

  const handleDeleteLeaderboardEntry = (entryId) => {
    setLeaderboardEntries((previous) => previous.filter((entry) => entry.id !== entryId));
  };

  return {
    goal,
    setGoal,
    goals,
    expenses,
    leaderboardEntries,
    gamification,
    points,
    level,
    xpToNextLevel,
    totalSavedAmount,
    earnedBadges,
    weeklyChallenges,
    handleAddExpense,
    handleAddCustomChallenge,
    handleAdvanceCustomChallenge,
    handleAddGoal,
    handleAddSavingsContribution,
    handleAddLeaderboardEntry,
    handleDeleteLeaderboardEntry,
  };
};

export default useAppData;
