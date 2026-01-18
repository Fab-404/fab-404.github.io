(() => {
    const pagesCount = 3; // nombre de pages
    const blocsPerPage = 6;

    const pagesWrapper = document.getElementById('pages-wrapper');
    const pageNumber = document.getElementById('pageNumber');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentPage = 0; // index réel (0 → pagesCount-1)

    function createTable() {
        const table = document.createElement('table');
        table.className = 'missions-table';

        const colgroup = document.createElement('colgroup');
        for (let i = 0; i < 7; i++) {
            const col = document.createElement('col');
            col.style.width = '10px';
            colgroup.appendChild(col);
        }
        table.appendChild(colgroup);

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="badge-header">
                <th colspan="7">Badge : Laurent B ( 0001 )</th>
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
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

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
        return page;
    }

    // Création des pages
    for (let i = 0; i < pagesCount; i++) {
        pagesWrapper.appendChild(createPage());
    }

    function updatePageNumber() {
        pageNumber.textContent = `Page ${currentPage + 1} / ${pagesCount}`;
    }

    function updateSlider() {
        const pageHeight = pagesWrapper.children[0].clientHeight;
        pagesWrapper.style.transition = 'transform 0.4s ease';
        pagesWrapper.style.transform = `translateY(${-currentPage * pageHeight}px)`;
        updatePageNumber();
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage === 0) return;
        currentPage--;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage === pagesCount - 1) return;
        currentPage++;
        updateSlider();
    });

    // Initialisation
    updateSlider();
})();
