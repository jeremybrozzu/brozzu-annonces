/**
 * BROZZU – réception des demandes de visite des annonces (Signature Collection).
 * Programme distinct de celui du simulateur d'estimation.
 *
 * Installation : dans une feuille Google Sheets « Demandes de visite », menu
 * Extensions > Apps Script, coller ce fichier, puis Déployer > Nouveau déploiement >
 * Application Web (exécuter en tant que : moi ; accès : tout le monde).
 *
 * Chaque demande est envoyée au négociateur du bien, avec une copie à COPIE,
 * et ajoutée comme ligne dans l'onglet « Demandes ».
 * Les adresses sont fixées ici et jamais lues dans la requête : personne ne peut
 * se servir de ce programme pour écrire à quelqu'un d'autre.
 */
const CONSEILLERS = {
  "jeremy-brozzu": "jeremy@brozzu.fr",
};
const COPIE = "contact@brozzu.fr";
const ONGLET = "Demandes";
const COLONNES = ["Date", "Bien", "Référence", "Suite demandée", "Négociateur", "Nom", "Téléphone", "E-mail",
  "Communes", "Budget maximum", "Apport", "Bien à vendre", "Détail"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data._source !== "brozzu-annonces") return reponse({ success: "false", message: "source inconnue" });
    // Champ piège : rempli uniquement par les robots.
    if (data._honey) return reponse({ success: "true" });

    const negociateur = CONSEILLERS[data._conseiller] || "";
    const destinataire = negociateur || COPIE;
    const objet = String(data._subject || "Nouvelle demande de visite").slice(0, 200);
    const champs = Object.keys(data).filter(function (k) { return k.charAt(0) !== "_"; });

    const texte = champs.map(function (k) { return k + " : " + data[k]; }).join("\n");
    const html = '<p style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#9B7355">' +
      'BROZZU – L\'Atelier Immo · Signature Collection</p>' +
      '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
      champs.map(function (k) {
        return '<tr><th style="text-align:left;padding:6px 12px;border-bottom:1px solid #E2D3C2;color:#853E1D;vertical-align:top">' +
          echap(k) + '</th><td style="padding:6px 12px;border-bottom:1px solid #E2D3C2">' + echap(String(data[k])) + '</td></tr>';
      }).join("") + '</table>' +
      '<p style="font-family:Arial,sans-serif;font-size:12px;color:#8A8079">Répondez à ce message pour écrire directement à l\'acquéreur.</p>';

    const options = { htmlBody: html, name: "BROZZU Signature Collection" };
    if (negociateur && negociateur !== COPIE) options.cc = COPIE;
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data._replyto || "")) options.replyTo = data._replyto;
    MailApp.sendEmail(destinataire, objet, texte, options);

    journal(data, negociateur || "—", champs);
    return reponse({ success: "true" });
  } catch (err) {
    return reponse({ success: "false", message: String(err) });
  }
}

function doGet() {
  return reponse({ ok: true, message: "Le point de réception des annonces BROZZU fonctionne." });
}

function journal(data, negociateur, champs) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return;
  let feuille = ss.getSheetByName(ONGLET);
  if (!feuille) {
    feuille = ss.insertSheet(ONGLET);
    feuille.appendRow(COLONNES);
    feuille.setFrozenRows(1);
  }
  const autres = champs.filter(function (k) { return COLONNES.indexOf(k) < 0; })
    .map(function (k) { return k + " : " + data[k]; }).join("\n");
  feuille.appendRow(COLONNES.map(function (c) {
    if (c === "Date") return new Date();
    if (c === "Négociateur") return negociateur;
    if (c === "Détail") return autres;
    return data[c] || "";
  }));
}

function reponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function echap(s) {
  return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}
