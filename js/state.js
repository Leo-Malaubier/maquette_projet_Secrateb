import { getDurationHours, getOverlapHours } from './utils.js';

export let state = JSON.parse(localStorage.getItem('edt_multi_profile_db')) || {
  currentProfileId: 'admin_1',
  profiles: [
    { id: 'admin_1', name: 'Administrateur', isAdmin: true },
    { id: 'user_1', name: 'Alice', isAdmin: false },
    { id: 'user_2', name: 'Bob', isAdmin: false }
  ],
  activities: [
    { id: '1', name: 'Travail', color: '#4f46e5' },
    { id: '2', name: 'Sport', color: '#10b981' },
    { id: '3', name: 'Loisirs', color: '#f59e0b' }
  ],
  schedules: {
    'admin_1': { routine: [], overrides: [] },
    'user_1': { routine: [], overrides: [] },
    'user_2': { routine: [], overrides: [] }
  }
};

let renderAllCallback = null;

export function registerRenderCallback(cb) {
  renderAllCallback = cb;
}

export function saveData() {
  localStorage.setItem('edt_multi_profile_db', JSON.stringify(state));
  if (renderAllCallback) renderAllCallback();
}

export function getCurrentSchedule() {
  if (!state.schedules[state.currentProfileId]) {
    state.schedules[state.currentProfileId] = { routine: [], overrides: [] };
  }
  return state.schedules[state.currentProfileId];
}

export function getCurrentProfile() {
  return state.profiles.find(p => p.id === state.currentProfileId) || state.profiles[0];
}

export function calculateProfileStats(profileId, monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const sched = state.schedules[profileId] || { routine: [], overrides: [] };

  const statsMap = {};
  state.activities.forEach(a => {
    statsMap[a.id] = { id: a.id, name: a.name, color: a.color, routineHours: 0, actualHours: 0 };
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const customDayIndex = (new Date(dStr + 'T00:00:00').getDay() + 6) % 7;

    const dayRoutine = sched.routine.filter(r => r.day === customDayIndex);
    dayRoutine.forEach(r => {
      if (statsMap[r.activityId]) statsMap[r.activityId].routineHours += getDurationHours(r.start, r.end);
    });

    const dayOverrides = sched.overrides.filter(o => o.date === dStr);

    dayRoutine.forEach(r => {
      let duration = getDurationHours(r.start, r.end);
      dayOverrides.forEach(o => { duration -= getOverlapHours(r.start, r.end, o.start, o.end); });
      if (duration > 0 && statsMap[r.activityId]) statsMap[r.activityId].actualHours += duration;
    });

    dayOverrides.forEach(o => {
      if (statsMap[o.activityId]) statsMap[o.activityId].actualHours += getDurationHours(o.start, o.end);
    });
  }

  let totalPlus = 0;
  let totalMinus = 0;

  const activitiesStats = Object.values(statsMap).map(s => {
    const netDiff = s.actualHours - s.routineHours;
    const plusHours = netDiff > 0 ? netDiff : 0;
    const minusHours = netDiff < 0 ? Math.abs(netDiff) : 0;

    totalPlus += plusHours;
    totalMinus += minusHours;

    return { ...s, netDiff, plusHours, minusHours };
  });

  return { activitiesStats, totalPlus, totalMinus, totalNet: totalPlus - totalMinus };
}
export function setOverrideStatus(profileId, overrideId, status) {
  const sched = state.schedules[profileId];
  if (!sched) return;
  const ov = sched.overrides.find(o => o.id === overrideId);
  if (ov) ov.status = status;
  saveData();
}

export function getMonthOverrides(profileId, monthStr) {
  const sched = state.schedules[profileId] || { routine: [], overrides: [] };
  return sched.overrides
    .filter(o => o.date.startsWith(monthStr))
    .sort((a, b) => a.date.localeCompare(b.date));
}
