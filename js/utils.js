export const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function formatDate(d) {
  return d.toISOString().split('T')[0];
}

export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function getDurationHours(start, end) {
  return (timeToMinutes(end) - timeToMinutes(start)) / 60;
}

export function checkOverlap(s1, e1, s2, e2) {
  return Math.max(timeToMinutes(s1), timeToMinutes(s2)) < Math.min(timeToMinutes(e1), timeToMinutes(e2));
}

export function getOverlapHours(s1, e1, s2, e2) {
  const startMax = Math.max(timeToMinutes(s1), timeToMinutes(s2));
  const endMin = Math.min(timeToMinutes(e1), timeToMinutes(e2));
  return Math.max(0, (endMin - startMax) / 60);
}
export const STATUS_LABELS = {
  attente: { label: 'En attente', cls: 'badge-attente' },
  valide:  { label: 'Validé',     cls: 'badge-valide' },
  refuse:  { label: 'Refusé',     cls: 'badge-refuse' }
};
