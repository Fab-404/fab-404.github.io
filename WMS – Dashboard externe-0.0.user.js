// ==UserScript==
// @name         WMS – Dashboard externe
// @match        file:///C:/Users/jdmor/Desktop/Nouveau%20dossier*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let missionsData = [];

    /* ===============================
       INTERCEPTION XHR
    =============================== */
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
                        console.log('[WMS] Missions chargées:', missionsData.length);
                    } catch (e) {
                        console.error('[WMS] Erreur JSON', e);
                    }
                }
            });
            return send.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.send);

    /* ===============================
       BOUTON ACTION
    =============================== */
    const btn = document.createElement('button');
    btn.textContent = 'Action';
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

    /* ===============================
       CLICK
    =============================== */
    btn.addEventListener('click', () => {

        const badgeFilter = '0001';
        const filtered = missionsData.filter(
            m => m.personnel?.badge === badgeFilter
        );

        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Dashboard WMS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSS GitHub Pages -->
    <link rel="stylesheet" href="https://fab-404.github.io/Path/style.css">

</head>
<body>

<div class="top-bar">
    <div class="top-bar-left"><span class="logo">WMS</span></div>
    <div class="top-bar-right">
        <a href="#">Dashboard</a>
        <a href="#">Missions</a>
        <a href="#">Admin</a>
    </div>
</div>

<div class="slider-container">
    <div class="pages-wrapper" id="pages-wrapper">
        <div class="bloc">
            <table class="missions-table">


            </table>
        </div>
    </div>
</div>

<div class="slider-controls">
    <button id="prevBtn">‹ Précédent</button>
    <button id="nextBtn">Suivant ›</button>
</div>

<div class="bottom-bar">© WMS</div>

<!-- JS GitHub Pages -->
<script src="https://fab-404.github.io/Path/script-slider.js"></script>


</body>
</html>
        `;

const blob = new Blob([html], { type: 'text/html' });
const url = URL.createObjectURL(blob);

window.open(
    url,
    '_blank',
    'width=1200,height=800,noopener'
);

    });

})();
