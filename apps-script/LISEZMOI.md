# Réception des demandes de visite (Google Apps Script)

Programme distinct de celui du simulateur d'estimation. Il reçoit chaque fiche acquéreur
des annonces, l'envoie au négociateur du bien avec une copie à contact@brozzu.fr, et
l'ajoute à une feuille Google Sheets.

## Installation (une fois)

1. Créer une feuille Google Sheets « Demandes de visite – Annonces BROZZU ».
2. Extensions > Apps Script, effacer le contenu, coller `Code.gs`, enregistrer.
3. Déployer > Nouveau déploiement > type « Application Web » :
   exécuter en tant que « Moi », accès « Tout le monde ». Autoriser l'accès demandé.
4. Copier l'URL de l'application Web (…/exec) et la renseigner dans la page de chaque
   annonce (`data-reception`).

## Ajouter un négociateur

Ajouter une ligne dans `CONSEILLERS` (identifiant → e-mail), puis
Déployer > Gérer les déploiements > modifier > Nouvelle version.
