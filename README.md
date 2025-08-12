# Brief 23 - Nouveau client pour Financial Tracker

## Description
Ce projet est une application **React** construite avec **Vite** servant de client pour l’API [simplon-2024-banking-api](https://github.com/shiipou/simplon-2024-banking-api).

L’application permet aux utilisateurs :
- De s’inscrire et se connecter via l’API
- De gérer leur session avec un système de **JWT**
- D’accéder à un tableau de bord après authentification
- D’installer l’application comme **PWA** pour un usage hors-ligne

---

## Prérequis
- [Node.js 18+](https://nodejs.org/)
- npm (inclus avec Node.js)
- L’API [simplon-2024-banking-api](https://github.com/shiipou/simplon-2024-banking-api) en cours d’exécution

---

## Installation
1. **Cloner le projet**
```bash
git clone https://github.com/OlivierV79/brief-23
cd brief-23
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l’URL de l’API**
   Vérifiez dans les fichiers des composants (`AuthForm.jsx`) que l’URL des endpoints `login` et `register` correspond à celle de votre API.

---

## Lancer en développement
```bash
npm run dev
```
L’application sera accessible sur [http://localhost:5173](http://localhost:5173).

---

## Build et Preview (pour PWA)
⚠️ La PWA ne peut pas être testée correctement en mode développement.  
Pour tester la version installable :

```bash
npm run build
npm run preview
```

Puis ouvrez [http://localhost:4173](http://localhost:4173).

---

## Fonctionnalités PWA
- **Installation sur bureau ou mobile**
- **Mode hors ligne** grâce à un service worker simple (`public/sw.js`)
- **Icônes personnalisées** (`pwa-192x192.png`, `pwa-512x512.png`)

Pour installer :
1. Ouvrir l’application buildée
2. Cliquer sur l’icône d’installation dans la barre d’adresse

---

## Authentification
- **POST /api/auth/register** : inscription
- **POST /api/auth/login** : connexion, renvoie `accessToken` et `username`
- Token stocké en **localStorage**
- Données utilisateur accessibles via `AuthContext`

---

## Licence
Ce projet est sous licence MIT.
