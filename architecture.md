# Architecture technique - Dashboard WMS

| Composant              | Description                                                                                   | Technologies / Outils              |
|------------------------|-----------------------------------------------------------------------------------------------|----------------------------------|
| **Page WMS**           | Application principale de gestion logistique, source des données missions via API XHR          | Application web existante         |
| **Script Tampermonkey**| Surcouche injectée côté client : interception XHR, stockage temporaire des missions, UI bouton | JavaScript, API Tampermonkey      |
| **Dashboard HTML**     | Page HTML autonome chargée dans une nouvelle fenêtre via Blob URL, affichage des missions      | HTML5, CSS3 (GitHub Pages), JS   |
| **Module Slider JS**   | Gestion de la pagination et affichage dynamique des tableaux et blocs                          | JavaScript modulaire externe      |
| **Module Config JS**   | Interface utilisateur pour configurer badges, nombre de grilles, sauvegarde dans localStorage  | JavaScript modulaire externe      |
| **Stockage Local**     | Persistance locale des configurations utilisateur (badges, affichage, etc.)                    | Web Storage API (localStorage)    |
| **CDN GitHub Pages**   | Hébergement des fichiers CSS et JS externes (slider, config, styles)                           | GitHub Pages, CDN public          |
| **Fenêtre Dashboard**  | Nouvelle fenêtre isolée chargée via Blob URL pour isoler contexte et éviter conflits           | API Blob, window.open             |

---

## Flux technique résumé

1. **Injection Tampermonkey**  
   - Sur la page WMS, le script intercepte les requêtes XHR ciblées  
   - Stocke temporairement les données missions  

2. **Ouverture Dashboard**  
   - Bouton injecté dans la page active l’ouverture d’une nouvelle fenêtre (Blob URL)  
   - Transmission des missions via injection JSON dans le HTML  

3. **Dashboard autonome**  
   - Charge les fichiers CSS et JS externes via CDN  
   - Récupère la configuration utilisateur depuis localStorage  
   - Génère dynamiquement les grilles / tableaux selon config et missions  

4. **Configuration utilisateur**  
   - Interface toggle dans le dashboard pour modifier la config  
   - Sauvegarde dans localStorage, reload dynamique possible du dashboard  

---

## Contraintes & Sécurité

- Aucun serveur backend ni stockage serveur  
- Données sensibles uniquement en mémoire ou localStorage (pas de persistance missions)  
- Chargement des ressources via HTTPS public (GitHub Pages)  
- Isolation via Blob URL pour limiter les interférences avec la page principale  
