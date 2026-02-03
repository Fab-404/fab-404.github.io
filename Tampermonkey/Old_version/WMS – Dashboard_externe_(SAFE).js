// ==UserScript==
// @name         WMS – Dashboard externe (SAFE)
// @match        https://wms.stef.com/SuiviDesMissions/*
// @version      1.22.1.26
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let missionsData = [];

    /* ===== Interception XHR ===== */
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', () => {
            if (this._url && this._url.includes('/services/mission/search')) {
                try {
                    const json = JSON.parse(this.responseText);
                    missionsData = Array.isArray(json.missions) ? json.missions : [];
                    console.log('[WMS] missions capturées:', missionsData.length);
                } catch (e) {
                    console.error('[WMS] erreur JSON', e);
                }
            }
        });
        return origSend.apply(this, arguments);
    };

    /* ===== Bouton Dashboard ===== */
    const btn = document.createElement('button');
    btn.textContent = 'Dashboard';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999999,
        padding: '10px 16px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {

        // ⚠️ ouverture IMMÉDIATE = popup autorisée
        const win = window.open(
            'https://fab-404.github.io/dashboard.html',
            '_blank',
            'width=1200,height=800'
        );

        if (!win) {
            alert('Popup bloquée par le navigateur');
            return;
        }

        console.log('[WMS] dashboard ouvert');

        // Envoi fiable (multi-tentatives)
        let tries = 0;
        const timer = setInterval(() => {
            tries++;

            if (win.closed) {
                clearInterval(timer);
                return;
            }

            win.postMessage(
                { type: 'missionsData', payload: missionsData },
                '*'
            );

            console.log('[WMS] envoi missions', tries, missionsData.length);

            if (tries >= 10) {
                clearInterval(timer);
            }
        }, 500);
    });
})();
