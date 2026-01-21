document.addEventListener('DOMContentLoaded', () => {

    // Toggle panneau config
    const toggleBtn = document.getElementById('config-toggle-btn');
    const panel = document.getElementById('config-panel');
    toggleBtn.addEventListener('click', () => {
        panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
    });

    // Gestion sauvegarde config en localStorage
    const STORAGE_KEY = 'wmsDashboardConfig';
    const saveBtn = document.getElementById('config-save-btn');
    const status = document.getElementById('save-status');
    const gridsInput = document.getElementById('grids-per-page');
    const badgesInput = document.getElementById('badges-list');

    // Charger config existante
    function loadConfig() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const config = JSON.parse(stored);
                gridsInput.value = config.gridsPerPage || 4;
                badgesInput.value = (config.badges || []).join(',');
            } catch {
                // ignore erreur JSON
            }
        }
    }
    loadConfig();

    // Sauvegarder config
    saveBtn.addEventListener('click', () => {
        const grids = parseInt(gridsInput.value, 10) || 4;
        const badges = badgesInput.value.split(',').map(b => b.trim()).filter(b => b.length);
        const config = { gridsPerPage: grids, badges };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        console.log('[Config] sauvegardée dans localStorage:', config); // log sauvegarde
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
    });

    // Log config au chargement
    function logConfig() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const config = JSON.parse(stored);
                console.log('[Config] config chargée depuis localStorage:', config);
            } catch (e) {
                console.warn('[Config] erreur parsing config', e);
            }
        } else {
            console.log('[Config] aucune config sauvegardée en localStorage');
        }
    }
    logConfig();

});
