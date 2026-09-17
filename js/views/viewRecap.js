import { state, getCurrentSchedule, calculateProfileStats } from '../state.js';
import { deleteOverride } from './viewDaily.js';

export function switchSubTab(subTab) {
  document.getElementById('subtab-log').style.display = subTab === 'log' ? 'block' : 'none';
  document.getElementById('subtab-stats').style.display = subTab === 'stats' ? 'block' : 'none';
  document.getElementById('tab-btn-log').classList.toggle('active', subTab === 'log');
  document.getElementById('tab-btn-stats').classList.toggle('active', subTab === 'stats');
}

export function renderRecap() {
  const logContainer = document.getElementById('overrides-log-list');
  logContainer.innerHTML = '';
  
  const sorted = [...getCurrentSchedule().overrides].sort((a,b) => b.date.localeCompare(a.date));
  if (!sorted.length) {
    logContainer.innerHTML = `<p style="font-size:0.9rem; color:#64748b;">Aucune modification.</p>`;
  } else {
    sorted.forEach(o => {
      const act = state.activities.find(a => a.id === o.activityId) || { name: 'Inconnue', color: '#ccc' };
      logContainer.innerHTML += `
        <div class="slot-item slot-modified">
          <div class="slot-info">
            <span class="slot-title" style="color:${act.color}">${o.date} : ${act.name}</span>
            <span class="slot-time">${o.start} - ${o.end} ${o.note ? '('+o.note+')' : ''}</span>
          </div>
          <button class="btn-danger" onclick="deleteOverride('${o.id}')">Supprimer</button>
        </div>`;
    });
  }
  renderStats();
}

export function renderStats() {
  const monthStr = document.getElementById('stats-month').value;
  if (!monthStr) return;

  const profileStats = calculateProfileStats(state.currentProfileId, monthStr);
  const tbody = document.getElementById('stats-table-body');
  tbody.innerHTML = '';

  profileStats.activitiesStats.forEach(s => {
    const diffText = s.netDiff > 0 ? `+${s.netDiff.toFixed(1)}h` : `${s.netDiff.toFixed(1)}h`;
    const diffClass = s.netDiff > 0 ? 'diff-plus' : (s.netDiff < 0 ? 'diff-minus' : '');

    tbody.innerHTML += `
      <tr>
        <td style="font-weight:bold; color:${s.color}">${s.name}</td>
        <td>${s.routineHours.toFixed(1)} h</td>
        <td>${s.actualHours.toFixed(1)} h</td>
        <td class="${diffClass}">${s.netDiff === 0 ? '0h' : diffText}</td>
      </tr>`;
  });
}