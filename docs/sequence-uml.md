# Diagramme de séquence UML

```plantuml
@startuml
actor Utilisateur
participant Navigateur
participant Tampermonkey
participant WMS
participant GitHubPages

Utilisateur -> Navigateur : clic bouton Action
Navigateur -> Tampermonkey : exécution script
Tampermonkey -> WMS : interception XHR search
WMS --> Tampermonkey : JSON missions
Tampermonkey -> Navigateur : window.open dashboard
Navigateur -> GitHubPages : chargement CSS / JS
GitHubPages --> Navigateur : assets
Navigateur -> Navigateur : rendu dashboard
@enduml
