/**
 * ============================================================================
 *  RÉCEPTION DES COMMANDES DANS GOOGLE SHEETS (boutique COD)
 * ============================================================================
 *
 *  ÉTAPES POUR LE DÉPLOYER (5 minutes) :
 *
 *  1. Ouvrez Google Sheets et créez une feuille vide (ex : "Commandes Dz Mode").
 *  2. Menu  Extensions  →  Apps Script.
 *  3. Supprimez tout le code présent, collez CE fichier en entier, puis
 *     cliquez sur l'icône 💾 (Enregistrer).
 *  4. (Recommandé) Dans la liste des fonctions en haut, choisissez "testerAjout"
 *     puis cliquez sur ▶ Exécuter. Google demande l'autorisation :
 *     Examiner les autorisations → votre compte → Paramètres avancés →
 *     Accéder au projet (non sécurisé) → Autoriser.
 *     Une ligne "TEST" doit apparaître dans l'onglet "Commandes" (supprimez-la ensuite).
 *  5. En haut à droite : Déployer → Nouveau déploiement.
 *       - Cliquez sur ⚙️ "Sélectionner le type" → Application Web
 *       - Exécuter en tant que : Moi
 *       - Qui a accès : Tout le monde      (⚠️ PAS "Tout le monde avec un compte Google")
 *     → Déployer.
 *  6. Copiez l'URL de l'application Web (elle se termine par /exec) et collez-la
 *     dans index.html :   const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/.../exec";
 *  7. Faites une commande test sur le site : elle apparaît dans la feuille.
 *
 *  ⚠️ Si vous modifiez ce script plus tard : Déployer → Gérer les déploiements →
 *     ✏️ Modifier → Version : "Nouvelle version" → Déployer. (L'URL reste la même.)
 *
 *  Astuce : Fichier → Paramètres → Fuseau horaire : (GMT+01:00) Alger,
 *  pour que la date des commandes soit à l'heure algérienne.
 * ============================================================================
 */

const NOM_FEUILLE = "Commandes";

const ENTETES = [
  "Date", "N° commande", "Nom complet", "Téléphone", "Wilaya", "Commune", "Adresse",
  "Type de livraison", "Produit", "Taille", "Couleur", "Quantité",
  "Prix unitaire (DA)", "Sous-total (DA)", "Livraison (DA)", "Total (DA)", "Statut"
];

/** Reçoit une commande envoyée par le site (POST). */
function doPost(e) {
  const verrou = LockService.getScriptLock();
  verrou.waitLock(20000); // évite que deux commandes simultanées s'écrasent
  try {
    const d = JSON.parse(e.postData.contents);
    const feuille = obtenirFeuille_();
    feuille.appendRow([
      new Date(),                       // date de réception (heure du fuseau du Sheet)
      d.numero || "",
      d.nom || "",
      "'" + (d.telephone || ""),        // l'apostrophe garde le 0 du début (05..., 06..., 07...)
      d.wilaya || "",
      d.commune || "",
      d.adresse || "",
      d.livraison || "",
      d.produit || "",
      d.taille || "",
      d.couleur || "",
      Number(d.quantite) || 1,
      Number(d.prixUnitaire) || 0,
      Number(d.sousTotal) || 0,
      Number(d.fraisLivraison) || 0,
      Number(d.total) || 0,
      "À confirmer"
    ]);
    feuille.getRange(feuille.getLastRow(), 1).setNumberFormat("dd/MM/yyyy HH:mm");
    return reponse_({ ok: true });
  } catch (err) {
    return reponse_({ ok: false, erreur: String(err) });
  } finally {
    verrou.releaseLock();
  }
}

/** Ouvrir l'URL /exec dans le navigateur affiche ce message : utile pour vérifier. */
function doGet() {
  return ContentService.createTextOutput("✅ Le script fonctionne. Les commandes du site arrivent dans l'onglet \"" + NOM_FEUILLE + "\".");
}

/** Crée l'onglet "Commandes" et la ligne d'en-têtes si besoin. */
function obtenirFeuille_() {
  const classeur = SpreadsheetApp.getActiveSpreadsheet();
  let feuille = classeur.getSheetByName(NOM_FEUILLE);
  if (!feuille) feuille = classeur.insertSheet(NOM_FEUILLE);
  if (feuille.getLastRow() === 0) {
    feuille.appendRow(ENTETES);
    feuille.getRange(1, 1, 1, ENTETES.length)
      .setFontWeight("bold").setBackground("#111827").setFontColor("#FFFFFF");
    feuille.setFrozenRows(1);
    feuille.setColumnWidths(1, ENTETES.length, 130);
    // Liste déroulante pour suivre le statut de chaque commande
    const regle = SpreadsheetApp.newDataValidation()
      .requireValueInList(["À confirmer", "Confirmée", "Pas de réponse", "Annulée", "Expédiée", "Livrée", "Retour"], true)
      .build();
    feuille.getRange(2, ENTETES.length, 1000, 1).setDataValidation(regle);
  }
  return feuille;
}

function reponse_(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}

/** À exécuter une fois à la main (▶) pour autoriser le script et vérifier qu'il écrit bien. */
function testerAjout() {
  doPost({ postData: { contents: JSON.stringify({
    numero: "TEST", nom: "TEST – à supprimer", telephone: "0555000000",
    wilaya: "16 - Alger", commune: "Bab Ezzouar", adresse: "Cité test",
    livraison: "À domicile", produit: "T-shirt Coton Premium", taille: "M", couleur: "Blanc",
    quantite: 1, prixUnitaire: 1990, sousTotal: 1990, fraisLivraison: 400, total: 2390
  }) } });
}
