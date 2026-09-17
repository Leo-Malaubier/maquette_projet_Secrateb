import { formatDate } from './utils.js';
import { registerRenderCallback } from './state.js';

// Import de toutes les vues
import { renderWeeklyCalendar, changeWeek, resetToCurrentWeek, setWeeklyMode } from './views/viewWeek.js';
import { renderRoutine, addRoutineSlot, deleteRoutineSlot } from './views/viewRoutine.js';
import { renderDailyView, addOverride, deleteOverride } from './views/viewDaily.js';
import { renderActivities, renderProfilesUI, addActivity, deleteActivity, switchProfile, addProfile, deleteProfile } from './views/viewActivities.js';
import { renderRecap, renderStats, switchSubTab } from './views/viewRecap.js';
import { renderAdminView, toggleAccordion } from './views/viewAdmin.js';

// Exportation globale pour les gestionnaires d'évènements HTML (onclick, onchange)
window.switchTab = switchTab;
window.switchSubTab = switchSubTab;
window.changeWeek = changeWeek;
window.resetToCurrentWeek = resetToCurrentWeek;
window.setWeeklyMode = setWeeklyMode;
window.addRoutineSlot = addRoutineSlot;
window.deleteRoutineSlot = deleteRoutineSlot;
window.renderRoutine = renderRoutine;
window.addOverride = addOverride;
window.deleteOverride = deleteOverride;
window.renderDailyView = renderDailyView;
window.addActivity = addActivity;
window.deleteActivity = deleteActivity;
window.switchProfile = switchProfile;
window.addProfile = addProfile;
window.deleteProfile = deleteProfile;
window.renderStats = renderStats;
window.renderAdminView = renderAdminView;
window.toggleAccordion = toggleAccordion;

// Navigation Onglets Principal
function switchTab(viewName, btnEl) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav button').forEach(b => b.classList.remove('active'));
  
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
}

// Fonction de rendu globale
function renderAll() {
  renderProfilesUI();
  renderWeeklyCalendar();
  renderActivities();
  renderRoutine();
  renderDailyView();
  renderRecap();
  renderAdminView();
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  const todayStr = formatDate(new Date());
  
  document.getElementById('daily-date').value = todayStr;
  document.getElementById('stats-month').value = todayStr.substring(0, 7);
  document.getElementById('admin-stats-month').value = todayStr.substring(0, 7);

  // Écouteur sur le sélecteur de profil
  document.getElementById('active-profile-select').addEventListener('change', (e) => {
    switchProfile(e.target.value);
  });

  registerRenderCallback(renderAll);
  renderAll();
});