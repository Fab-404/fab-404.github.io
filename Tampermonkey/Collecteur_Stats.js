// ==UserScript==
// @name         WMS – Collecteur Stats
// @match        file:///C:/Users/jdmor/Desktop/Nouveau%20dossier/suiviDesMissions.html*
// @match        file:///*suiviDesMissions.html*
// @version      2026-01-27
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TOURNEES = ['60BEZ', '61ANG', '60MON', '60CAS', '60ANG'];
  const STORAGE_KEY = 'wms_stats_latest';
  let currentMissions = [];

  // 🔹 Capturer missions en Prod
  if (location.protocol !== 'file:') {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      this.addEventListener('load', () => {
        if (this._url?.includes('/services/mission/search')) {
          try {
            const json = JSON.parse(this.responseText);
            currentMissions = Array.isArray(json?.missions) ? json.missions : [];
          } catch (e) {
            console.error('[WMS Stats] Erreur XHR', e);
          }
        }
      });
      return origSend.apply(this, arguments);
    };
  }

  // 🔹 Calcul des stats
  function computeStats(missions) {
    const result = {};

    TOURNEES.forEach(t => {
      const all = missions.filter(m =>
        m.tournee === t && typeof m.nombreUl === 'number'
      );
      const total = all.reduce((s, m) => s + m.nombreUl, 0);
      const termine = all
        .filter(m => m.state?.label === 'Terminée')
        .reduce((s, m) => s + m.nombreUl, 0);

      result[t] = {
        total,
        termine,
        raf: total - termine,
        percent: total ? Number(((termine / total) * 100).toFixed(1)) : 0
      };
    });

    // Ajout du total global
    const global = TOURNEES.reduce(
      (acc, t) => {
        acc.total += result[t].total;
        acc.termine += result[t].termine;
        return acc;
      },
      { total: 0, termine: 0 }
    );
    global.raf = global.total - global.termine;
    global.percent = global.total ? Number(((global.termine / global.total) * 100).toFixed(1)) : 0;
    result.GLOBAL = global;

    return result;
  }

  // 🔹 Bouton
  const btn = document.createElement('button');
  btn.textContent = '📊 Collecter Stats';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    zIndex: 999999,
    padding: '10px 16px',
    background: '#6f42c1',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  });

  btn.addEventListener('click', () => {
    let missions = [];

    if (location.protocol === 'file:') {
      // 🔹 DEV : charger depuis GitHub
      fetch('https://raw.githubusercontent.com/Fab-404/fab-404.github.io/refs/heads/main/config/MissionData_terminer.json')
        .then(r => r.json())
        .then(data => {
          missions = data.missions || [];
          const stats = computeStats(missions);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stats, null, 2));
          alert(`✅ Stats sauvegardées (${Object.keys(stats).length - 1} tournées).`);
        })
        .catch(e => {
          console.error('[DEV] Erreur', e);
          alert('❌ Échec chargement données.');
        });
    } else {
      // 🔹 PROD : utiliser missions capturées
      const stats = computeStats(currentMissions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats, null, 2));
      alert(`✅ Stats sauvegardées (${Object.keys(stats).length - 1} tournées).`);
    }
  });

  document.body.appendChild(btn);
  console.log('[WMS Stats] Prêt – clic pour collecter.');
})();
