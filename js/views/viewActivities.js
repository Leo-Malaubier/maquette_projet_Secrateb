import { state, getCurrentProfile, saveData } from '../state.js';

export function switchProfile(profileId) {
  state.currentProfileId = profileId;
  saveData();
}

export function addProfile() {
  const name = document.getElementById('new-profile-name').value.trim();
  const isAdmin = document.getElementById('new-profile-role').value === 'true';

  if (!name) return alert("Veuillez saisir un nom de profil.");

  const newId = 'prof_' + Date.now();
  state.profiles.push({ id: newId, name, isAdmin });
  state.schedules[newId] = { routine: [], overrides: [] };
  
  document.getElementById('new-profile-name').value = '';
  saveData();
}

export function deleteProfile(id) {
  if (state.profiles.length <= 1) return alert("Impossible de supprimer le seul profil restant.");
  if (confirm("Supprimer ce profil et tout son emploi du temps ?")) {
    state.profiles = state.profiles.filter(p => p.id !== id);
    delete state.schedules[id];
    if (state.currentProfileId === id) {
      state.currentProfileId = state.profiles[0].id;
    }
    saveData();
  }
}

export function renderProfilesUI() {
  const select = document.getElementById('active-profile-select');
  const container = document.getElementById('profiles-list');
  const adminNavBtn = document.getElementById('nav-admin-btn');
  
  select.innerHTML = '';
  container.innerHTML = '';

  const currentProf = getCurrentProfile();
  adminNavBtn.style.display = currentProf.isAdmin ? 'flex' : 'none';

  state.profiles.forEach(p => {
    select.innerHTML += `<option value="${p.id}" ${p.id === state.currentProfileId ? 'selected' : ''}>${p.name} ${p.isAdmin ? '(Admin)' : ''}</option>`;

    container.innerHTML += `
      <div class="slot-item">
        <div>
          <strong>${p.name}</strong> 
          <span class="${p.isAdmin ? 'badge-admin-role' : 'badge-user'}">${p.isAdmin ? 'Admin' : 'Utilisateur'}</span>
        </div>
        ${p.id !== state.currentProfileId ? `<button class="btn-danger" onclick="deleteProfile('${p.id}')">Supprimer</button>` : '<small style="color:var(--text-light)">Actif</small>'}
      </div>
    `;
  });
}

export function addActivity() {
  const name = document.getElementById('act-name').value.trim();
  const color = document.getElementById('act-color').value;
  if (!name) return alert("Saisir un nom.");
  state.activities.push({ id: Date.now().toString(), name, color });
  document.getElementById('act-name').value = '';
  saveData();
}

export function deleteActivity(id) {
  if (confirm("Supprimer cette activité ?")) {
    state.activities = state.activities.filter(a => a.id !== id);
    Object.keys(state.schedules).forEach(pId => {
      state.schedules[pId].routine = state.schedules[pId].routine.filter(r => r.activityId !== id);
      state.schedules[pId].overrides = state.schedules[pId].overrides.filter(o => o.activityId !== id);
    });
    saveData();
  }
}

export function renderActivities() {
  const container = document.getElementById('activities-list');
  const selectRoutine = document.getElementById('routine-activity');
  const selectMod = document.getElementById('mod-activity');

  container.innerHTML = ''; selectRoutine.innerHTML = ''; selectMod.innerHTML = '';

  state.activities.forEach(act => {
    container.innerHTML += `
      <div class="slot-item" style="border-left-color:${act.color}">
        <span class="slot-title" style="color:${act.color}">${act.name}</span>
        <button class="btn-danger" onclick="deleteActivity('${act.id}')">Supprimer</button>
      </div>`;
    selectRoutine.innerHTML += `<option value="${act.id}">${act.name}</option>`;
    selectMod.innerHTML += `<option value="${act.id}">${act.name}</option>`;
  });
}