# WMS – Dashboard externe (Tampermonkey)

## 1. Objectif du projet

Créer un **dashboard externe de pilotage WMS** sans modifier l’application existante,
sans serveur, sans droits administrateur, et avec des outils gratuits.

Le dashboard :
- intercepte les données WMS côté navigateur
- les transforme
- les affiche dans une interface dédiée, stylée et maintenable

---

## 2. Contraintes

- ❌ Aucun accès serveur
- ❌ Aucune modification du WMS
- ❌ Aucune autorisation IT requise
- ✅ Fonctionnement 100 % navigateur
- ✅ Déployable sur plusieurs postes

---

## 3. Architecture globale

[ WMS Web ]
↓ (XHR JSON)
[ Tampermonkey ]
↓ (window.open + data)
[ Dashboard externe ]
↓
[ CSS / JS hébergés GitHub Pages ]


---

## 4. Rôle de chaque composant

### WMS
- Fournit les données via `/services/mission/search`
- Aucun impact, aucune modification

### Tampermonkey
- Intercepte les requêtes XHR
- Stocke les données missions
- Déclenche l’ouverture du dashboard
- Injecte les données filtrées

### GitHub Pages
- Héberge CSS et JS
- Sépare la logique métier du script Tampermonkey
- Facilite maintenance et mises à jour

---

## 5. Flux de données (résumé)

1. Le WMS charge les missions
2. Tampermonkey intercepte la réponse JSON
3. L’utilisateur clique sur **Action**
4. Une nouvelle fenêtre s’ouvre
5. Le dashboard est rendu avec les assets GitHub

---

## 6. Avantages de cette approche

- ✅ Maintenance centralisée
- ✅ Déploiement rapide sur d’autres postes
- ✅ Code Tampermonkey minimal
- ✅ Aucun backend
- ✅ Faible surface de risque sécurité

---

## 7. Technologies

- Tampermonkey
- JavaScript (ES6)
- HTML5 / CSS3
- GitHub Pages
- UML (documentation)

---

## 8. Évolutions prévues

- Sélection dynamique du badge
- Filtres avancés
- Pagination intelligente
- Export CSV
- Mode multi-badges
