Participant Utilisateur
Participant PageWMS
Participant ScriptTampermonkey
Participant DashboardFenetre
Participant LocalStorage

Utilisateur -> PageWMS : Ouvre page WMS
PageWMS -> ScriptTampermonkey : Injection et interception XHR activée
ScriptTampermonkey -> PageWMS : Surveille requêtes /services/mission/search
PageWMS -> ScriptTampermonkey : Requête XHR vers /services/mission/search
ScriptTampermonkey -> ScriptTampermonkey : Capture réponse JSON missions
ScriptTampermonkey -> Variable globale missionsData : Stocke missions

Utilisateur -> ScriptTampermonkey : Clique bouton "Dashboard"
ScriptTampermonkey -> DashboardFenetre : Ouvre nouvelle fenêtre (blob URL)
ScriptTampermonkey -> DashboardFenetre : Injecte HTML + JSON.stringify(missionsData)
DashboardFenetre -> LocalStorage : Charge config (gridsPerPage, badges)
DashboardFenetre -> DashboardFenetre : Génère grilles et tableaux selon config et missions

Utilisateur -> DashboardFenetre : Clique bouton toggle config
DashboardFenetre -> DashboardFenetre : Affiche panneau config

Utilisateur -> DashboardFenetre : Modifie config et clique sauvegarder
DashboardFenetre -> LocalStorage : Enregistre nouvelle config
DashboardFenetre -> DashboardFenetre : Rafraîchit affichage tableau selon nouvelle config

Utilisateur -> DashboardFenetre : Ferme fenêtre
