(() => {
  const pagesWrapper = document.getElementById('pages-wrapper');
  const STORAGE_KEY = 'wmsDashboardConfig';

  function loadConfig() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    // valeurs par défaut
    return { gridsPerPage: 4, badges: ['0001'] };
  }

  function createTable(badge, missions) {
    const table = document.createElement('table');
    table.className = 'missions-table';
    table.innerHTML = `
      <thead>
        <tr class="badge-header">
          <th colspan="7">Badge : ${badge}</th>
        </tr>
        <tr>
          <th>Fiche</th>
          <th>Train</th>
          <th>Support</th>
          <th>Tournée</th>
          <th>Nb UL</th>
          <th>Poids</th>
          <th>État</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    missions.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${m.codeFichePreparation ?? ''}</td>
        <td>${m.posTrain ?? ''}</td>
        <td>${m.aliasSupport ?? ''}</td>
        <td>${m.tournee ?? ''}</td>
        <td>${m.nombreUl ?? ''}</td>
        <td>${m.poidsBrut ? m.poidsBrut.toFixed(3) : ''}</td>
        <td>${m.state?.label ?? ''}</td>
      `;
      tbody.appendChild(tr);
    });

    return table;
  }

  function createPage(badges, missionsByBadge, blocsPerPage) {
    const page = document.createElement('main');
    page.className = 'grid-main';

    const toDisplay = badges.slice(0, blocsPerPage);

    toDisplay.forEach(badge => {
      const bloc = document.createElement('div');
      bloc.className = 'bloc';

      const missions = missionsByBadge[badge] || [];
      bloc.appendChild(createTable(badge, missions));

      page.appendChild(bloc);
    });

    // Fixe 2 colonnes, nombre de lignes automatique
    page.style.gridTemplateColumns = 'repeat(2, 1fr)';
    page.style.gridAutoRows = 'min-content';

    return page;
  }

  function renderDashboard(missions) {
    pagesWrapper.innerHTML = '';

    const config = loadConfig();
    console.log('[Dashboard] Config:', config);

    const missionsByBadge = {};
    config.badges.forEach(b => missionsByBadge[b] = []);
    missions.forEach(m => {
      const b = m.personnel?.badge;
      if (b && missionsByBadge[b]) missionsByBadge[b].push(m);
    });

    const page = createPage(config.badges, missionsByBadge, config.gridsPerPage);
    pagesWrapper.appendChild(page);
  }

  window.renderDashboard = renderDashboard;

  if (window.missionsData && window.missionsData.length) {
    renderDashboard(window.missionsData);
  }
})();
