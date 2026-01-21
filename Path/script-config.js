document.addEventListener('DOMContentLoaded', () => {
  const btnConfig = document.getElementById('configBtn');
  const configBox = document.getElementById('configBox');
  const inputBadges = document.getElementById('inputBadges');
  const saveConfig = document.getElementById('saveConfig');
  const CONFIG_KEY = 'wmsDashboardConfig';

  btnConfig.addEventListener('click', () => {
    if (configBox.style.display === 'none' || !configBox.style.display) {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        const cfg = JSON.parse(stored);
        inputBadges.value = cfg.badges.join(',');
      } else {
        inputBadges.value = '0001';
      }
      configBox.style.display = 'block';
    } else {
      configBox.style.display = 'none';
    }
  });

  saveConfig.addEventListener('click', () => {
    const badges = inputBadges.value
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    localStorage.setItem(CONFIG_KEY, JSON.stringify({ badges }));
    alert('Configuration sauvegardée. Rechargez le dashboard.');
  });
});
