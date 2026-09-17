import { state, getCurrentSchedule, saveData } from '../state.js';

export function addRoutineSlot() {
  const day = parseInt(document.getElementById('routine-day').value);
  const start = document.getElementById('routine-start').value;
  const end = document.getElementById('routine-end').value;
  const activityId = document.getElementById('routine-activity').value;

  if (!activityId || start >= end) return alert("Saisie invalide.");

  getCurrentSchedule().routine.push({ id: Date.now().toString(), day, start, end, activityId });
  saveData();
}

export function deleteRoutineSlot(id) {
  const sched = getCurrentSchedule();
  sched.routine = sched.routine.filter(r => r.id !== id);
  saveData();
}

export function renderRoutine() {
  const day = parseInt(document.getElementById('filter-routine-day').value);
  const container = document.getElementById('routine-list');
  container.innerHTML = '';

  const slots = getCurrentSchedule().routine.filter(r => r.day === day).sort((a,b) => a.start.localeCompare(b.start));
  if(!slots.length) return container.innerHTML = `<p style="font-size:0.9rem; color:#64748b;">Aucun créneau.</p>`;

  slots.forEach(s => {
    const act = state.activities.find(a => a.id === s.activityId) || { name: 'Inconnue', color: '#ccc' };
    container.innerHTML += `
      <div class="slot-item" style="border-left-color:${act.color}">
        <div class="slot-info">
          <span class="slot-title">${act.name}</span>
          <span class="slot-time">${s.start} - ${s.end}</span>
        </div>
        <button class="btn-danger" onclick="deleteRoutineSlot('${s.id}')">Supprimer</button>
      </div>`;
  });
}