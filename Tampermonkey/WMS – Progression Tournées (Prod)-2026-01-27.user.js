// ==UserScript==
// @name         WMS – Progression Tournées (Prod)
// @match        file:///C:/Users/jdmor/Desktop/Nouveau%20dossier/suiviDesMissions.html*
// @version      2026-01-27
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const TOURNEES = ['60BEZ', '61ANG', '60MON', '60CAS', '60ANG'];
  let latestProgress = {};

  // 🔹 Bouton d'affichage
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

  btn.addEventListener('click', () => {
    let msg = '✅ Progression des tournées\n\n';
    let hasData = false;

    TOURNEES.forEach(t => {
      const d = latestProgress[t];
      if (d && d.total > 0) {
        msg += `${t}: ${d.termine} / ${d.total} UL (${d.percent}%)\n`;
        hasData = true;
      }
    });

    alert(hasData ? msg : '❌ Aucune donnée pour les tournées surveillées.');
  });

  document.body.appendChild(btn);

  // 🔹 Interception XHR
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
          const missions = Array.isArray(json?.missions) ? json.missions : [];

          // Calcul pour chaque tournée
          const result = {};
          TOURNEES.forEach(t => {
            const all = missions.filter(m =>
              m.tournee === t && typeof m.nombreUl === 'number'
            );
            const total = all.reduce((s, m) => s + m.nombreUl, 0);
            const termine = all
              .filter(m => m.state?.label === 'Terminée')
              .reduce((s, m) => s + m.nombreUl, 0);
            const percent = total > 0 ? ((termine / total) * 100).toFixed(1) : 0;
            result[t] = { termine, total, percent: parseFloat(percent) };
          });

          latestProgress = result;

          // Log discret (optionnel)
          const now = new Date().toLocaleTimeString();
          console.log(`[WMS-Progress] Mis à jour à ${now}`);
        } catch (e) {
          console