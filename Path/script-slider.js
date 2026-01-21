(() => {
    /* ===============================
       DONNÉES
    =============================== */
    const ALL_MISSIONS = window.__MISSIONS__ || [];

    console.log('[DASHBOARD] missions totales:', ALL_MISSIONS.length);

    /* ===============================
       CONFIG (simple)
    =============================== */
    const CONFIG_KEY = 'wmsDashboardConfig';

    const config = JSON.parse(
        localStorage.getItem(CONFIG_KEY) || '{"badges":["0001"]}'
    );

    const BADGES = config.badges;

    console.log('[DASHBOARD] badges config:', BADGES);

    const pagesWrapper = document.getElementById('pages-wrapper');

    /* ===============================
       PARAMÈTRES GRID
    =============================== */
    const blocsPerPage = 4; // 2x2
    const cols = 2;
    const rows = 2;

    /* ===============================
       UTILS
    =============================== */
    function getMissionsByBadge(badge) {
        return ALL_MISSIONS.filter(
            m => m.personnel?.badge === badge
        );
    }

    /* ===============================
       TABLE
    =============================== */
    function createTable(badge) {
        const missions = getMissionsByBadge(badge);

        console.log(`[DASHBOARD] badge ${badge}:`, missions.length);

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

    /* ===============================
       PAGE
    =============================== */
    function createPage(badgesSlice) {
        const page = document.createElement('main');
        page.className = 'grid-main';

        badgesSlice.forEach(badge => {
            const bloc = document.createElement('div');
            bloc.className = 'bloc';
            bloc.appendChild(createTable(badge));
            page.appendChild(bloc);
        });

        page.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        page.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        return page;
    }

    /* ===============================
       GÉNÉRATION DES PAGES
    =============================== */
    for (let i = 0; i < BADGES.length; i += blocsPerPage) {
        const slice = BADGES.slice(i, i + blocsPerPage);
        pagesWrapper.appendChild(createPage(slice));
    }
})();
