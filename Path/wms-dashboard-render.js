(() => {
  const pagesWrapper = document.getElementById('pages-wrapper');
  const STORAGE_KEY = 'wmsDashboardConfig';

  /* ==============================
     CONFIG AFFICHAGE PAR GRILLE
     ============================== */

  const ROWS_BY_GRID = {
    4: 12, // 4 blocs → 12 lignes par tableau
    6: 8,  // 6 blocs → 8 lignes
    8: 6   // 8 blocs → 6 lignes
  };

  const DEFAULT_ROWS = 10; // fallback si grille non déclarée

  function getMaxRowsPerTable(blocsPerPage) {
    return ROWS_BY_GRID[blocsPerPage] ?? DEFAULT_ROWS;
  }

  /* ==============================
     CONFIG DASHBOARD
     ============================== */

  function loadConfig() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return {
      gridsPerPage: 4,
      badges: ['0001']
    };
  }

  /* ==============================
     TABLE
     ============================== */

  function createTable(badge, missions, maxRows) {
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

    missions.slice(0, maxRows).forEach(m => {
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

    // indication lignes masquées (optionnelle mais utile)
    if (missions.length > maxRows) {
      const tr = document.createElement('tr');
      tr.className = 'rows-hidden';
      tr.innerHTML = `
        <td colspan="7">
          +${missions.length - maxRows} lignes non affichées
        </td>
      `;
      tbody.appendChild(tr);
    }

    return table;
  }

  /* ==============================
     PAGE / GRILLE
     ============================== */

  function createPage(badges, missionsByBadge, blocsPerPage) {
    const page = document.createElement('main');
    page.className = 'grid-main';

    const maxRows = getMaxRowsPerTable(blocsPerPage);
    const toDisplay = badges.slice(0, blocsPerPage);

    toDisplay.forEach(badge => {
      const bloc = document.createElement('div');
      bloc.className = 'bloc';

      const missions = missionsByBadge[badge] || [];
      bloc.appendChild(createTable(badge, missions, maxRows));

      page.appendChild(bloc);
    });

    page.style.gridTemplateColumns = 'repeat(2, 1fr)';
    page.style.gridAutoRows = 'min-content';

    return page;
  }

  /* ==============================
     RENDER
     ============================== */

  function renderDashboard(missions) {
    pagesWrapper.innerHTML = '';

    const config = loadConfig();
    console.log('[Dashboard] Config:', config);

    const missionsByBadge = {};
    config.badges.forEach(b => missionsByBadge[b] = []);

    missions.forEach(m => {
      const badge = m.personnel?.badge;
      if (badge && missionsByBadge[badge]) {
        missionsByBadge[badge].push(m);
      }
    });

    const page = createPage(
      config.badges,
      missionsByBadge,
      config.gridsPerPage
    );

    pagesWrapper.appendChild(page);
  }

  /* ==============================
     EXPOSITION
     ============================== */

  window.renderDashboard = renderDashboard;

  if (window.missionsData?.length) {
    renderDashboard(window.missionsData);
  }

})();
