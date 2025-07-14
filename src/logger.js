export function log(action, data) {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({ time: new Date().toISOString(), action, data });
  localStorage.setItem('logs', JSON.stringify(logs));
}
