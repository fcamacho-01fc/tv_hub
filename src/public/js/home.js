async function loadUser() {
  const response = await fetch('/api/users/me');
  if (!response.ok) { location.href = '/login'; return; }
  const user = await response.json();
  document.querySelector('#welcome').textContent = `Welcome, ${user.email} (${user.role})`;
}
document.querySelector('#logout').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.href = '/login';
});
loadUser();
