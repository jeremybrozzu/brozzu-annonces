/**
 * Point d'entrée des pages statiques (hors Next.js) : monte le parcours acquéreur.
 * Avec data-reception="<application Web Apps Script>" (et data-conseiller-id), la fiche
 * part vers le programme Google des annonces ; data-envoi="<e-mail>" sert de secours via
 * FormSubmit. Sans l'un ni l'autre : mode « aperçu », sans aucun envoi.
 * Compilé avec esbuild (voir README, « Aperçu publié »).
 */
import { createRoot } from "react-dom/client";
import { ParcoursVisite } from "@/components/visite/ParcoursVisite";

const hote = document.getElementById("parcours-apercu")!;
createRoot(hote).render(
  <ParcoursVisite
    bien={hote.dataset.bien!}
    titreBien={hote.dataset.titre!}
    agenda={hote.dataset.agenda}
    conseiller={hote.dataset.conseiller}
    envoiDirect={hote.dataset.envoi}
    pointReception={hote.dataset.reception}
    conseillerId={hote.dataset.conseillerId}
    apercu={!hote.dataset.envoi && !hote.dataset.reception}
  />,
);
