import { DAYS, getMonday, formatDate, checkOverlap } from '../utils.js';
import { state, getCurrentSchedule } from '../state.js';

let currentWeekMonday = getMonday(new Date());
let weeklyViewMode = 'usuel';

export function renderWeeklyCalendar() {
  const grid = document.getElementById('weekly-grid-container');
  grid.innerHTML = '';

  const sunday = new Date(currentWeekMonday);
  sunday.setDate(sunday.getDate() + 6);

  const formatShort = d => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
  document.getElementById('week-display-label').innerText = `Du ${formatShort(currentWeekMonday)} au ${formatShort(sunday)}`;

  const todayStr = formatDate(new Date());
  const sched = getCurrentSchedule();

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(currentWeekMonday);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = formatDate(dayDate);
    const isToday = dateStr === todayStr;

    const col = document.createElement('div');
    col.className = `day-column ${isToday ? 'is-today' : ''}`;
    
    col.innerHTML = `
      <div class="day-header">
        <div class="day-name">${DAYS[i]}</div>
        <div class="day-date">${formatShort(dayDate)}</div>
      </div>
      <div class="day-events"></div>
    `;
    grid.appendChild(col);

    const eventsContainer = col.querySelector('.day-events');
    let dayEvents = [];

    if (weeklyViewMode === 'usuel') {
      dayEvents = sched.routine
        .filter(r => r.day === i)
        .map(r => ({ ...r, isModified: false }))
        .sort((a,b) => a.start.localeCompare(b.start));
    } else {
      const dayRoutine = sched.routine.filter(r => r.day === i);
      const dayOverrides = sched.overrides.filter(o => o.date === dateStr);

      dayRoutine.forEach(r => {
        const isImpacted = dayOverrides.some(o => checkOverlap(r.start, r.end, o.start, o.end));
        if (!isImpacted) dayEvents.push({ ...r, isModified: false });
      });

      dayOverrides.forEach(o => dayEvents.push({ ...o, isModified: true }));
      dayEvents.sort((a,b) => a.start.localeCompare(b.start));
    }

    if (dayEvents.length === 0) {
      eventsContainer.innerHTML = `<span style="font-size:0.8rem; color:#94a3b8; text-align:center; margin-top:15px;">-</span>`;
    } else {
      dayEvents.forEach(e => {
        const act = state.activities.find(a => a.id === e.activityId) || { name: 'Inconnue', color: '#94a3b8' };
        const card = document.createElement('div');
        card.className = `cal-card ${e.isModified ? 'modified' : ''}`;
        card.style.borderLeftColor = act.color;
        card.innerHTML = `
          <div class="cal-card-title">
            <span>${act.name}</span>
            ${e.isModified ? '<span class="badge-modified">Modifié</span>' : ''}
          </div>
          <div class="cal-card-time">${e.start} - ${e.end}</div>
          ${e.note ? `<div class="cal-card-note">${e.note}</div>` : ''}
        `;
        eventsContainer.appendChild(card);
      });
    }
  }
}

export function changeWeek(daysOffset) {
  currentWeekMonday.setDate(currentWeekMonday.getDate() + daysOffset);
  renderWeeklyCalendar();
}

export function resetToCurrentWeek() {
  currentWeekMonday = getMonday(new Date());
  renderWeeklyCalendar();
}

export function setWeeklyMode(mode) {
  weeklyViewMode = mode;
  document.getElementById('week-mode-usuel').classList.toggle('active', mode === 'usuel');
  document.getElementById('week-mode-modifie').classList.toggle('active', mode === 'modifie');
  renderWeeklyCalendar();
}