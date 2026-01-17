function initSlider() {

    const pagesCount = 3; // nombre de pages
    const blocsPerPage = 6;
    const pagesWrapper = document.getElementById('pages-wrapper');
    const pageNumber = document.getElementById('pageNumber');

    if (!pagesWrapper) {
        console.warn('pages-wrapper introuvable');
        return;
    }

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
            </tr>`;
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

    // Nettoyage si rechargement
    pagesWrapper.innerHTML = '';

    // Création pages
    for (let p = 0; p < pagesCount; p++) {
        pagesWrapper.appendChild(createPage());
    }

    // Clones (slider infini)
    const pages = pagesWrapper.children;
    const firstClone = pages[0].cloneNode(true);
    const lastClone = pages[pages.length - 1].cloneNode(true);

    pagesWrapper.insertBefore(lastClone, pages[0]);
    pagesWrapper.appendChild(firstClone);

    let currentPage = 1;
    const totalPages = pagesCount + 2;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let isAnimating = false;

    function updatePageNumber() {
        pageNumber.textContent = `Page ${currentPage} / ${pagesCount}`;
    }

    function updateSlider(animate = true) {
        if (animate && isAnimating) return;
        if (animate) isAnimating = true;

        const pageHeight = pagesWrapper.children[0].clientHeight;

        pagesWrapper.style.transition = animate
            ? 'transform 0.4s ease'
            : 'none';

        pagesWrapper.style.transform =
            `translateY(${-currentPage * pageHeight}px)`;

        updatePageNumber();

        if (!animate) {
            void pagesWrapper.offsetHeight;
            pagesWrapper.style.transition = 'transform 0.4s ease';
            isAnimating = false;
        }
    }

    pagesWrapper.addEventListener('transitionend', () => {
        if (currentPage === 0) {
            currentPage = pagesCount;
            updateSlider(false);
        } else if (currentPage === totalPages - 1) {
            currentPage = 1;
            updateSlider(false);
        } else {
            isAnimating = false;
        }
    });

    prevBtn?.addEventListener('click', () => {
        if (isAnimating) return;
        currentPage--;
        updateSlider();
    });

    nextBtn?.addEventListener('click', () => {
        if (isAnimating) return;
        currentPage++;
        updateSlider();
    });

    updateSlider(false);
}

/* exposition globale */
window.initSlider = initSlider;
