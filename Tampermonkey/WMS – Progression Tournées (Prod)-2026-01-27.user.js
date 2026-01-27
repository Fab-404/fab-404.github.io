// ==UserScript==
// @name         WMS – Progression Tournées (Prod)
// @match        https://wms.stef.com/SuiviDesMissions/*
// @version      2026-01-27.2
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* =============================
     CONFIG
  ============================== */

  const TOURNEES = ['60BEZ', '60ANG', '60MON', '60CAS', '61ANG'];
  let latestProgress = {};

  /* =============================
     BOUTON
  ============================== */

  const btn = document.createElement('button');
  btn.textContent = '📊 Progression Tournées';

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
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  });

  btn.onclick = openStatsPage;
  document.body.appendChild(btn);

  /* =============================
     PAGE STATS (OVERLAY)
  ============================== */

  function openStatsPage() {
    const existing = document.getElementById('wms-stats-page');
    if (existing) {
      existing.remove();
      return;
    }

    const page = document.createElement('div');
    page.id = 'wms-stats-page';

    Object.assign(page.style, {
      position: 'fixed',
      inset: 0,
      background: '#f4f6f8',
      zIndex: 1000000,
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      overflow: 'auto'
    });

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1 style="margin:0;">Progression des tournées</h1>
        <button id="wms-close"
          style="padding:8px 14px; font-size:14px; cursor:pointer;">
          Fermer
        </button>
      </div>

      <table style="margin-top:20px; width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#ddd;">
            <th style="padding:8px; text-align:left;">Base</th>
            <th>UL terminées</th>
            <th>UL totales</th>
            <th>%</th>
            <th style="width:40%;">Progression</th>
          </tr>
        </thead>
        <tbody>
    `;

    /* ===== GLOBAL ===== */

    const global = TOURNEES.reduce((acc, t) => {
      const d = latestProgress[t];
      if (!d) return acc;
      acc.total += d.total;
      acc.termine += d.termine;
      return acc;
    }, { total: 0, termine: 0 });

    const globalPercent = global.total > 0
      ? Number(((global.termine / global.total) * 100).toFixed(1))
      : 0;

    if (global.total > 0) {
      html += `
        <tr style="background:#cfe2ff; font-weight:bold; border-bottom:2px solid #333;">
          <td style="padding:8px;">GLOBAL</td>
          <td style="text-align:center;">${global.termine}</td>
          <td style="text-align:center;">${global.total}</td>
          <td style="text-align:center;">${globalPercent}%</td>
          <td>
            <div style="background:#b6d4fe; height:16px; border-radius:4px;">
              <div style="
                width:${globalPercent}%;
                background:#0d6efd;
                height:100%;
                border-radius:4px;">
              </div>
            </div>
          </td>
        </tr>
      `;
    }

    /* ===== DETAIL PAR TOURNEE ===== */

    TOURNEES.forEach(t => {
      const d = latestProgress[t];
      if (!d || d.total === 0) return;

      html += `
        <tr style="background:#fff; border-bottom:1px solid #ccc;">
          <td style="padding:8px;">${t}</td>
          <td style="text-align:center;">${d.termine}</td>
          <td style="text-align:center;">${d.total}</td>
          <td style="text-align:center;">${d.percent}%</td>
          <td>
            <div style="background:#e0e0e0; height:14px; border-radius:4px;">
              <div style="
                width:${d.percent}%;
                background:#28a745;
                height:100%;
                border-radius:4px;">
              </div>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    page.innerHTML = html;
    document.body.appendChild(page);

    document.getElementById('wms-close').onclick = () => page.remove();
  }

  /* =============================
     INTERCEPTION XHR
  ============================== */

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', () => {
      if (!this._url || !this._url.includes('/services/mission/search')) return;

      try {
        const json = JSON.parse(this.responseText);
        const missions = Array.isArray(json?.missions) ? json.missions : [];

        const result = {};

        TOURNEES.forEach(t => {
          const all = missions.filter(m =>
            m.tournee === t && typeof m.nombreUl === 'number'
          );

          const total = all.reduce((s, m) => s + m.nombreUl, 0);
          const termine = all
            .filter(m => m.state?.label === 'Terminée')
            .reduce((s, m) => s + m.nombreUl, 0);

          const percent = total > 0
            ? Number(((termine / total) * 100).toFixed(1))
            : 0;

          result[t] = { termine, total, percent };
        });

        latestProgress = result;
        console.log('[WMS-Progress] Stats mises à jour', latestProgress);

      } catch (e) {
        console.error('[WMS-Progress] Erreur parsing XHR', e);
      }
    });

    return origSend.apply(this, arguments);
  };

})();
