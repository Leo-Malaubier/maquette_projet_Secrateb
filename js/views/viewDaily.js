import { state, getCurrentSchedule, saveData } from '../state.js';
import { STATUS_LABELS } from '../utils.js';

export function addOverride() {
  const date = document.getElementById('daily-date').value;
  const start = document.getElementById('mod-start').value;
  const end = document.getElementById('mod-end').value;
  const activityId = document.getElementById('mod-activity').value;
  const note = document.getElementById('mod-note').value.trim();

  if (!date || !activityId || start >= end) return alert("Saisie invalide.");

  getCurrentSchedule().overrides.push({ id: Date.now().toString(), date, start, end, activityId, note });
  document.getElementById('mod-note').value = '';
  saveData();
}

export function deleteOverride(id) {
  const sched = getCurrentSchedule();
  sched.overrides = sched.overrides.filter(o => o.id !== id);
  saveData();
}

export function renderDailyView() {
  const dateVal = document.getElementById('daily-date').value;
  if (!dateVal) return;

  const container = document.getElementById('daily-actual-list');
  container.innerHTML = '';

  const dayOverrides = getCurrentSchedule().overrides.filter(o => o.date === dateVal).sort((a,b) => a.start.localeCompare(b.start));

  if (!dayOverrides.length) {
    container.innerHTML = `<p style="font-size:0.9rem; color:#64748b;">Aucune modification pour cette date.</p>`;
    return;
  }

  dayOverrides.forEach(item => {
    const act = state.activities.find(a => a.id === item.activityId) || { name: 'Inconnue', color: '#ccc' };
    container.innerHTML += `
      <div class="slot-item slot-modified" style="border-left-color:${act.color}">
        <div class="slot-info">
          <span class="slot-title">${act.name} <span class="badge-modified">Modifié</span></span>
          <span class="slot-time">${item.start} - ${item.end} ${item.note ? '• <i>'+item.note+'</i>' : ''}</span>
        </div>
        <button class="btn-danger" onclick="deleteOverride('${item.id}')">Supprimer</button>
      </div>`;
  });
}
