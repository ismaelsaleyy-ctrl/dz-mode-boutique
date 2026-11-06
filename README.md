# Dz Mode – Boutique e-commerce COD (démo)

Boutique de démonstration **fictive** de vêtements et chaussures, pensée pour le marché algérien : paiement à la livraison (COD), livraison vers les 58 wilayas, visiteurs venant de publicités Facebook / TikTok sur mobile.

Tout tient dans **un seul fichier** : [`index.html`](index.html) (HTML + CSS + JavaScript, aucune dépendance).

> Site de démonstration : la marque, les produits, les prix et les avis sont des exemples.

## Fonctionnalités

- Design mobile d'abord, chargement rapide
- Français / arabe (bascule RTL), prix en DA
- Accueil : bannière promo, 8 produits (4 vêtements, 4 chaussures), « Pourquoi nous choisir », FAQ
- Page produit : galerie 3 photos, tailles (S–XL / 39–45), couleurs, quantité, compte à rebours, stock limité, avis exemple
- Formulaire de commande COD sur la page produit, sans compte :
  - validation du téléphone algérien (05 / 06 / 07, 10 chiffres)
  - 58 wilayas, livraison à domicile ou au bureau (stop desk)
  - prix de livraison automatique selon la wilaya et le type
  - récapitulatif en temps réel, bouton collant sur mobile
- Page de remerciement avec récapitulatif
- Envoi des commandes vers **Google Sheets** (Apps Script)
- **Meta Pixel** et **TikTok Pixel** : PageView, ViewContent, AddToCart, InitiateCheckout, Purchase (valeur en DZD)
- Bouton WhatsApp flottant

## Adapter la boutique à un client

Toutes les variables sont regroupées en haut de `index.html`, avec des commentaires en français :

| Variable | Rôle |
|---|---|
| `NOM_BOUTIQUE` | Nom affiché dans le logo et le titre |
| `COULEURS` | Couleur principale, accent, succès, fond |
| `WHATSAPP_NUMERO`, `TELEPHONE_AFFICHE`, `RESEAUX_SOCIAUX` | Contact |
| `META_PIXEL_ID`, `TIKTOK_PIXEL_ID` | ID des pixels (laisser `VOTRE_ID` pour désactiver) |
| `GOOGLE_SHEET_URL` | URL de l'application Web Apps Script (`.../exec`) |
| `BANDEAU_PROMO`, `BANNIERE` | Textes et image de la bannière |
| `PRIX_LIVRAISON` | Prix domicile / bureau pour chacune des 58 wilayas (`null` = stop desk indisponible) |
| `PRODUITS`, `AVIS_EXEMPLE` | Catalogue et avis |

Astuce : ajouter `?lang=ar` à l'URL ouvre directement la version arabe.

## Recevoir les commandes dans Google Sheets

1. Créer un Google Sheet → **Extensions → Apps Script**.
2. Coller le contenu de [`google-apps-script.js`](google-apps-script.js) et enregistrer.
3. Exécuter une fois `testerAjout` pour autoriser le script.
4. **Déployer → Nouveau déploiement → Application Web**, « Exécuter en tant que : Moi », « Qui a accès : Tout le monde ».
5. Copier l'URL (`.../exec`) dans `GOOGLE_SHEET_URL`.

Sans URL, la démo fonctionne quand même : la commande s'affiche dans la console du navigateur et la page de remerciement apparaît.

## Crédits

- Photos : [Unsplash](https://unsplash.com) (licence Unsplash)
- Icônes : [Lucide](https://lucide.dev) (ISC) et [Simple Icons](https://simpleicons.org) (CC0)
