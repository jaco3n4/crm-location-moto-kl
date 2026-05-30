# 🏍️ CRM Location Moto — Kuala Lumpur

Petit CRM (sans serveur) pour **prospecter les agences de location de moto à Kuala Lumpur** :
recenser les agences, les **contacter en un clic** (WhatsApp / email avec message pré-rempli
demandant les tarifs) et **suivre l'avancement** de chaque échange dans un pipeline.

> Application **100 % statique** (React + Vite). Les données sont stockées dans **ton navigateur**
> (`localStorage`). Pense à utiliser **Exporter** pour faire une sauvegarde JSON.

## ✨ Fonctionnalités

- Fiches agences : nom, quartier (Bukit Bintang, KLCC, Chinatown…), contacts, tarifs (RM), caution, modèles, note, commentaires.
- **Contact en 1 clic** : bouton WhatsApp (`wa.me`) et email (`mailto`) avec un message d'enquête prêt à l'emploi (en anglais).
- **Pipeline** : À contacter → Contacté → A répondu → Prix reçu → En négociation → Validé / Pas de réponse / Pas intéressé.
- Recherche, filtres (statut, quartier), tri, statistiques cliquables.
- Ajout / édition / suppression, changement de statut rapide depuis la carte.
- **Export / Import JSON** pour sauvegarder et transférer tes données.

## 🚀 Lancer en local

```bash
npm install
npm run dev
```

Ouvre l'URL affichée (par défaut http://localhost:5173).

Pour tester la version de production :

```bash
npm run build
npm run preview
```

## 🌐 Héberger sur GitHub Pages (compte `jaco3n4`)

Le dépôt contient déjà un workflow d'automatisation (`.github/workflows/deploy.yml`).

1. **Créer le dépôt** et pousser le code :
   ```bash
   git init
   git add -A
   git commit -m "CRM location moto KL"
   gh auth login                       # connexion à ton compte GitHub
   gh repo create jaco3n4/crm-location-moto-kl --public --source=. --push
   ```
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
3. À chaque `git push` sur `main`, le site est rebuild et publié automatiquement sur :
   `https://jaco3n4.github.io/crm-location-moto-kl/`

> `vite.config.js` utilise `base: './'` : le build marche quel que soit le nom du dépôt,
> rien d'autre à configurer.

### Alternative sans GitHub Actions
```bash
npm install --save-dev gh-pages
npx gh-pages -d dist        # après npm run build
```

## 🗂️ Structure

```
src/
  App.jsx              état global, filtres, CRUD, export/import
  constants.js         statuts du pipeline, quartiers de KL, devise
  utils.js             liens WhatsApp/email, formatage, message d'enquête
  storage.js           persistance localStorage + normalisation
  data/seed.js         exemples de démarrage (à remplacer par de vraies agences)
  components/          Header, StatsBar, Toolbar, AgencyCard, AgencyModal, ConfirmDialog…
```

## 💡 Astuce de prospection

Cherche **« motorbike rental Kuala Lumpur »** sur Google Maps, ajoute chaque agence ici,
puis clique sur **WhatsApp** pour leur envoyer directement la demande de tarifs. 🛵
