(() => {
    const ALL_MISSIONS = window.__MISSIONS__ || [];

    const BADGE = '0001';
    const missions = ALL_MISSIONS.filter(
        m => m.personnel?.badge === BADGE
    );

    console.log('[DASHBOARD] missions totales:', ALL_MISSIONS.length);
    console.log('[DASHBOARD] missions badge 0001:', missions.length);

    const pagesWrapper = document.getElementById('pages-wrapper');

    /* ===============================
       CONFIG SIMPLE
    =============================== */
    const pagesCount = 1;
    const blocsPerPage = 4;

    function createTable() {
        const table = document.createElement('table');
        table.className = 'missions-table';

        table.innerHTML = `
            <thead>
                <tr class="badge-header">
                    <th colspan="7">Badge : 0001</th>
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

    function createPage() {
        const page = document.createElement('main');
        page.className = 'grid-main';

        for (let i = 0; i < blocsPerPage; i++) {
            const bloc = document.createElement('div');
            bloc.className = 'bloc';
            bloc.appendChild(createTable());
            page.appendChild(bloc);
        }

        page.style.gridTemplateColumns = 'repeat(2, 1fr)';
        page.style.gridTemplateRows = 'repeat(2, 1fr)';

        return page;
    }

    for (let i = 0; i < pagesCount; i++) {
        pagesWrapper.appendChild(createPage());
    }
})();
Dashboard
