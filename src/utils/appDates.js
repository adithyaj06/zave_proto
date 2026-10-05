// Shared local-calendar helpers for streaks, monthly tracking, and weekly challenges.
export const getDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Return the year-month portion of the app's local date key.
export const getMonthKey = (date = new Date()) => getDateKey(date).slice(0, 7);

// Return the Monday date key for the week containing the provided date.
export const getWeekStartKey = (date = new Date()) => {
  const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  return getDateKey(weekStart);
};

// List the Monday-start weeks that overlap a calendar month.
export const getMonthWeekKeys = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const weekStart = new Date(year, month - 1, 1);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

  const weekKeys = [];
  while (weekStart <= lastDay) {
    weekKeys.push(getDateKey(weekStart));
    weekStart.setDate(weekStart.getDate() + 7);
  }
  return firstDay <= lastDay ? weekKeys : [];
};

// Continue a streak only when activity is on the next consecutive local day.
export const getNextStreak = (currentGamification, today) => {
  if (!currentGamification.lastDepositDate) return 1;
  if (currentGamification.lastDepositDate === today) return currentGamification.streak;

  const previousDate = new Date(`${currentGamification.lastDepositDate}T00:00:00`);
  const currentDate = new Date(`${today}T00:00:00`);
  const dayDifference = Math.round((currentDate - previousDate) / 86400000);
  return dayDifference === 1 ? currentGamification.streak + 1 : 1;
};
