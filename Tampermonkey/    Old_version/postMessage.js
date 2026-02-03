// ==UserScript==
// @name         WMS – Dashboard externe via postMessage
// @match        file:///C:/Users/jdmor/Desktop/Nouveau%20dossier/suiviDesMissions.html
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let missionsData = [];

    // Interception XHR
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            return open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    (function (send) {
        XMLHttpRequest.prototype.send = function () {
            this.addEventListener('load', function () {
                if (this._url && this._url.includes('/services/mission/search')) {
                    try {
                        const json = JSON.parse(this.responseText);
                        missionsData = json.missions || [];
                        console.log('[WMS] missions capturées:', missionsData.length);
                    } catch (e) {
                        console.error('[WMS] erreur JSON', e);
                    }
                }
            });
            return send.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.send);

    // Bouton
    const btn = document.createElement('button');
    btn.textContent = 'Dashboard';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '999999',
        padding: '10px 16px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        console.log('[WMS] ouverture dashboard');

        // Ouvre la page dashboard hébergée (remplace par ta vraie URL)
        const dashboardUrl = 'https://fab-404.github.io/dashboard.html';

        const dashboardWindow = window.open(dashboardUrl, '_blank', 'width=1200,height=800,noopener');

        if (!dashboardWindow) {
            alert('Impossible d’ouvrir la fenêtre du dashboard. Vérifie les pop-up blockers.');
            return;
        }

        // Poll pour envoyer les données dès que la fenêtre est prête
        const interval = setInterval(() => {
            if (dashboardWindow && dashboardWindow.postMessage) {
                dashboardWindow.postMessage({ type: 'missionsData', payload: missionsData }, '*');
                console.log('[WMS] missions envoyées au dashboard:', missionsData.length);
                clearInterval(interval);
            }
        }, 200);
    });
})();
