(() => {
  const pagesWrapper = document.getElementById('pages-wrapper');

  const STORAGE_KEY = 'wmsDashboardConfig';

  // Charger config depuis localStorage ou valeurs par défaut
  function loadConfig() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Crée un tableau pour un badge donné avec ses missions
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

  // Crée une page avec N blocs (grilles), chaque bloc un tableau
  function createPage(badges, missionsByBadge, blocsPerPage) {
    const page = document.createElement('main');
    page.className = 'grid-main';

    const toDisplay = badges.slice(0, blocsPerPage);

    toDisplay.forEach(badge => {
      const bloc = document.createElement('div');
      bloc.className = 'bloc';

      const missions = missionsByBadge[badge] || [];
      const table = createTable(badge, missions);

      bloc.appendChild(table);
      page.appendChild(bloc);
    });

    // Grille dynamique en fonction des blocs
    const cols = Math.min(2, toDisplay.length);
    const rows = Math.ceil(toDisplay.length / cols);

    page.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    page.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    return page;
  }

  // Rendu complet
  function renderDashboard(missions) {
    pagesWrapper.innerHTML = ''; // Clear précédent contenu

    const config = loadConfig() || { gridsPerPage: 4, badges: ['0001'] };

    console.log('[Dashboard] Config:', config);

    // Grouper missions par badge
    const missionsByBadge = {};
    config.badges.forEach(badge => {
      missionsByBadge[badge] = [];
    });

    missions.forEach(m => {
      const badge = m.personnel?.badge;
      if (badge && missionsByBadge.hasOwnProperty(badge)) {
        missionsByBadge[badge].push(m);
      }
    });

    // Pour l'instant, 1 page
    const pagesCount = 1;

    for (let i = 0; i < pagesCount; i++) {
      const page = createPage(config.badges, missionsByBadge, config.gridsPerPage);
      pagesWrapper.appendChild(page);
    }
  }

  // Expose renderDashboard pour le recevoir depuis postMessage
  window.renderDashboard = renderDashboard;

  // Si missions déjà présentes au chargement (ex: window.__MISSIONS__)
  if (window.missionsData && window.missionsData.length) {
    renderDashboard(window.missionsData);
  }
})();
