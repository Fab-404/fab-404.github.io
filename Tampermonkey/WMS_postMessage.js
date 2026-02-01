// ==UserScript==
// @name         WMS – Collecteur Stats (postMessage)
// @match        file:///C:/Users/jdmor/Desktop/Nouveau%20dossier/suiviDesMissions.html*
// @match        file:///*suiviDesMissions.html*
// @version      2026-01-27-postMessage
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TOURNEES = ['60BEZ', '61ANG', '60MON', '60CAS', '60ANG'];
  let statsData = {};
  let dashboardWindow = null;
  let sendTimer = null;

  // Détection du mode (DEV en local, PROD sur WMS)
  const IS_DEV = location.protocol === 'file:';

  /* ===== MODE DEV : Charger données depuis GitHub ===== */
  if (IS_DEV) {
    console.log('[WMS Stats] Mode DEV détecté - chargement données GitHub...');
    fetch('https://raw.githubusercontent.com/Fab-404/fab-404.github.io/refs/heads/main/config/MissionData_terminer.json')
      .then(r => r.json())
      .then(data => {
        const missions = data.missions || [];
        statsData = computeStats(missions);
        console.log('[WMS Stats] Mode DEV - Stats calculées depuis GitHub:', Object.keys(statsData).length - 1, 'tournées -', statsData.GLOBAL.termine + '/' + statsData.GLOBAL.total, 'UL (' + statsData.GLOBAL.percent + '%)');
      })
      .catch(e => {
        console.error('[WMS Stats] Erreur chargement GitHub', e);
      });
  }

  /* ===== Interception XHR (PROD seulement) ===== */
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
          const missions = Array.isArray(json.missions) ? json.missions : [];

          // Calculer les stats
          statsData = computeStats(missions);
          console.log('[WMS Stats] Mode PROD - Stats calculées:', Object.keys(statsData).length - 1, 'tournées -', statsData.GLOBAL.termine + '/' + statsData.GLOBAL.total, 'UL (' + statsData.GLOBAL.percent + '%)');

          // Envoyer au dashboard si ouvert
          if (dashboardWindow && !dashboardWindow.closed) {
            startSendingStats();
          }
        } catch (e) {
          console.error('[WMS Stats] Erreur JSON', e);
        }
      }
    });
    return origSend.apply(this, arguments);
  };

  /* ===== Calcul des stats ===== */
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

  /* ===== Envoi périodique des stats ===== */
  function startSendingStats() {
    if (sendTimer) {
      clearInterval(sendTimer);
    }
    let tries = 0;
    sendTimer = setInterval(() => {
      tries++;
      if (!dashboardWindow || dashboardWindow.closed) {
        clearInterval(sendTimer);
        sendTimer = null;
        return;
      }
      dashboardWindow.postMessage(
        { type: 'statsData', payload: statsData },
        '*'
      );
      console.log('[WMS Stats] envoi stats (tentative)', tries, 'tournées:', Object.keys(statsData).length - 1, 'global:', statsData.GLOBAL);
      if (tries >= 10) {
        clearInterval(sendTimer);
        sendTimer = null;
      }
    }, 500);
  }

  /* ===== Bouton Dashboard ===== */
  const btn = document.createElement('button');
  btn.textContent = '📊 Stats Dashboard';
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
    dashboardWindow = window.open(
      'https://fab-404.github.io/dashboard_v2(1).html',
      '_blank',
      'width=1200,height=800'
    );
    if (!dashboardWindow) {
      alert('Popup bloquée par le navigateur');
      return;
    }
    console.log('[WMS Stats] dashboard ouvert');
    startSendingStats();
  });

  document.body.appendChild(btn);

  /* ===== Clic automatique sur "Rechercher" ===== */
  function clickRechercher() {
    const btns = [...document.querySelectorAll('.OM33NN-ib-r')];
    const btnRecherche = btns.find(el => el.textContent.trim() === 'Rechercher');
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    if (btnRecherche) {
      console.log(`[${timeString}] [WMS Stats] Bouton Rechercher trouvé, clic simulé`);
      btnRecherche.click();

      // Relancer l'envoi si dashboard ouvert
      if (dashboardWindow && !dashboardWindow.closed) {
        startSendingStats();
      }
    } else {
      console.log(`[${timeString}] [WMS Stats] Bouton Rechercher non trouvé`);
    }
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      clickRechercher();
      setInterval(clickRechercher, 30000);
    }, 1000);
  });

  console.log(`[WMS Stats] Collecteur prêt en mode postMessage (${IS_DEV ? 'DEV' : 'PROD'})`);
})();
