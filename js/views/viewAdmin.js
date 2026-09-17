import { state, calculateProfileStats } from '../state.js';

export function toggleAccordion(rowId) {
  const targetRow = document.getElementById(rowId);
  if (targetRow) {
    targetRow.classList.toggle('open');
  }
}

export function renderAdminView() {
  const monthStr = document.getElementById('admin-stats-month').value;
  if (!monthStr) return;

  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.profiles.forEach(p => {
    const pStats = calculateProfileStats(p.id, monthStr);
    const netClass = pStats.totalNet > 0 ? 'diff-plus' : (pStats.totalNet < 0 ? 'diff-minus' : '');
    const netText = pStats.totalNet > 0 ? `+${pStats.totalNet.toFixed(1)} h` : `${pStats.totalNet.toFixed(1)} h`;

    const rowId = `accordion-${p.id}`;

    tbody.innerHTML += `
      <tr class="profile-summary-row" onclick="toggleAccordion('${rowId}')">
        <td><strong>${p.name}</strong></td>
        <td><span class="${p.isAdmin ? 'badge-admin-role' : 'badge-user'}">${p.isAdmin ? 'Admin' : 'Utilisateur'}</span></td>
        <td class="diff-plus">+${pStats.totalPlus.toFixed(1)} h</td>
        <td class="diff-minus">-${pStats.totalMinus.toFixed(1)} h</td>
        <td class="${netClass}">${pStats.totalNet === 0 ? '0 h' : netText}</td>
        <td style="text-align: right;">
          <button class="btn btn-sm" style="width:auto;">Détails ▼</button>
        </td>
      </tr>
      <tr id="${rowId}" class="accordion-details-row">
        <td colspan="6">
          <div class="accordion-inner-container">
            <h4 style="margin-bottom:10px; font-size:0.9rem; color:var(--primary);">Détails par activité pour ${p.name} (${monthStr})</h4>
            <table class="sub-table">
              <thead>
                <tr>
                  <th>Activité</th>
                  <th>Temps Normal</th>
                  <th>Temps Effectif</th>
                  <th>Heures en +</th>
                  <th>Heures en -</th>
                  <th>Écart Net</th>
                </tr>
              </thead>
              <tbody>
                ${pStats.activitiesStats.map(act => `
                  <tr>
                    <td style="font-weight:bold; color:${act.color}">${act.name}</td>
                    <td>${act.routineHours.toFixed(1)} h</td>
                    <td>${act.actualHours.toFixed(1)} h</td>
                    <td class="diff-plus">${act.plusHours > 0 ? '+' + act.plusHours.toFixed(1) + ' h' : '-'}</td>
                    <td class="diff-minus">${act.minusHours > 0 ? '-' + act.minusHours.toFixed(1) + ' h' : '-'}</td>
                    <td class="${act.netDiff > 0 ? 'diff-plus' : (act.netDiff < 0 ? 'diff-minus' : '')}">
                      ${act.netDiff === 0 ? '0h' : (act.netDiff > 0 ? '+' : '') + act.netDiff.toFixed(1) + ' h'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    `;
  });
}