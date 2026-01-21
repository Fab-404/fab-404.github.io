# Synthèse Projet Dashboard WMS – État actuel

---

## 1. Architecture générale

```
Utilisateur
   ↓ (navigateur)
Tampermonkey Script (injecté sur la page WMS)
   ↓ (XHR interceptées, bouton Dashboard injecté)
Page HTML autonome (dashboard.html hébergée sur GitHub)
   ↓ (charge CSS + JS depuis GitHub)
Dashboard (affiche missions par badge, selon config)
   ↓
LocalStorage (stocke la config utilisateur : badges, nombre de grilles)
```

---

## 2. Composants

### a) Script Tampermonkey principal (injecté sur la page WMS)

- Intercepte les requêtes XHR sur `/services/mission/search`.
- Stocke les missions capturées dans `window.missionsData`.
- Injecte un bouton « Dashboard » en bas à droite.
- Ouvre une nouvelle fenêtre avec une page `dashboard.html` hébergée sur GitHub (Blob URL ou URL directe).
- Transmet `missionsData` à la page via injection JavaScript (`window.__MISSIONS__`).

---

### b) Page dashboard.html (hébergée sur GitHub)

- Structure HTML complète (barre top, conteneur slider, footer).
- Charge le CSS depuis GitHub (`style.css`).
- Charge le script slider principal (`script-slider.js`) qui :
  - Récupère les missions via `window.__MISSIONS__`.
  - Charge la configuration depuis `localStorage` (clé `wmsDashboardConfig`).
  - Regroupe les missions par badge.
  - Affiche un nombre configurable de blocs (grilles) dans une grille à 2 colonnes et lignes dynamiques.
- Contient un panneau configuration toggleable (bouton + panneau caché) pour modifier badges et nombre de grilles.
- Sauvegarde la config dans `localStorage` et propose de rafraîchir le dashboard pour appliquer.

---

### c) Fichiers externes (hébergés sur GitHub)

| Fichier          | Description                            | URL                                                                |
|------------------|------------------------------------|------------------------------------------------------------------|
| style.css        | Styles CSS pour dashboard & config | `https://fab-404.github.io/Path/style.css`                       |
| script-slider.js | Logique affichage dashboard          | `https://fab-404.github.io/Path/script-slider.js`                |
| script-config.js | Logique panneau config toggle + save | (à créer et héberger sur GitHub, ex: `https://fab-404.github.io/Path/script-config.js`) |
| dashboard.html   | Page HTML dashboard complète         | (à créer et héberger, ou générée via Tampermonkey Blob URL)      |

---

## 3. Détails techniques clés

| Élément                    | Description                                        |
|----------------------------|--------------------------------------------------|
| Interception XHR           | Override `XMLHttpRequest.open` et `send` pour capter `/services/mission/search` |
| Transmission des données   | Injection JSON missions dans page dashboard via variable globale `window.__MISSIONS__` |
| Configuration utilisateur | Stockage/lecture config (`badges`, `gridsPerPage`) dans `localStorage` clé `wmsDashboardConfig` |
| Affichage                  | Grille CSS 2 colonnes, lignes dynamiques, blocs par badge |
| Sauvegarde config          | Via panneau toggle dans dashboard, message confirmation, reload manuel possible |
| Portabilité                | Scripts indépendants, page hébergée séparément, facile à déployer multi-postes |

---

## 4. Éléments à fournir / préparer pour reprise

### a) Tampermonkey Script principal

```js
// Tampermonkey script principal
// Interception XHR, bouton Dashboard, ouverture dashboard.html avec missions injectées
// Voir code complet déjà fourni (version simplifiée sans CSS/JS embarqués)
```

### b) dashboard.html (sur GitHub)

- Structure HTML complète (top-bar, pages-wrapper, bottom-bar).
- Lien vers CSS : `https://fab-404.github.io/Path/style.css`
- Lien vers JS principal dashboard : `https://fab-404.github.io/Path/script-slider.js`
- Injection des missions via `<script>window.__MISSIONS__ = ...</script>`
- Intégration panneau config toggle (bouton + div caché)
- Chargement script config toggle depuis : `https://fab-404.github.io/Path/script-config.js`

### c) style.css (hébergé sur GitHub)

- Contient styles pour :
  - `.grid-main` (2 colonnes, lignes dynamiques)
  - `.bloc`
  - `.missions-table`
  - Panneau config et bouton toggle
  - Barre top et bottom

### d) script-slider.js (hébergé sur GitHub)

- Récupération config locale
- Regroupement missions par badge
- Création dynamique des tables + pages + grilles
- Application styles CSS dynamiquement si besoin

### e) script-config.js (hébergé sur GitHub)

- Toggle panneau config
- Chargement/sauvegarde config dans `localStorage`
- Message confirmation sauvegarde
- (optionnel) déclenchement rafraîchissement du dashboard

---

## 5. Points d’amélioration futurs

- Pagination multi-pages dans dashboard (au-delà de `gridsPerPage`)
- Rafraîchissement automatique ou bouton refresh dans dashboard
- Validation des entrées config (badges valides, nombre grilles cohérent)
- Support multi-utilisateurs / multi-postes avec stockage serveur
- Meilleure gestion des erreurs et logs

---

## 6. Conclusion

Le projet est fonctionnel côté interception, stockage, affichage dashboard et configuration basique.  
Il est architecturé pour être maintenable, portable et facilement extensible.  
Le découpage entre scripts Tampermonkey et fichiers hébergés GitHub assure modularité et simplicité de déploiement.

---

Si tu veux, je peux te préparer un ZIP complet avec tous les fichiers nécessaires et liens à jour pour repartir sur une base propre.
