/**
 * Dessin d'une image de la séquence.
 *
 * - Écran au format proche de la vidéo : plein cadre (« cover »).
 * - Vidéo portrait sur écran large : l'image entière dans un cadre central,
 *   souligné de traits de construction (rappel du logo), sur un fond flou de
 *   la même image. Rien n'est rogné, rien n'est déformé.
 */

/** Écart de format à partir duquel on passe en mode cadre. */
const FRAMED_RATIO = 1.25;

/**
 * Mode cadre dans les deux sens : vidéo portrait sur écran large, ou vidéo paysage sur
 * téléphone tenu droit (sinon recadrée à un tiers de sa largeur et agrandie près de 3 fois).
 */
export function isFramed(cw: number, ch: number, iw: number, ih: number) {
  const ratio = cw / ch / (iw / ih);
  return ratio > FRAMED_RATIO || ratio < 0.5;
}

export function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  // Agrandissement de meilleure qualité (réinitialisé à chaque redimensionnement du canvas).
  ctx.imageSmoothingQuality = "high";
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

/**
 * @param progress 0 → 1 : le cadre s'agrandit légèrement au fil du scroll,
 *   pour accompagner la sensation d'avancer dans le lieu.
 */
export function drawFramed(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
  progress: number,
  dpr: number,
  lineColor: string,
) {
  // Autour du cadre, on laisse voir le fond flou placé sous le canvas.
  ctx.clearRect(0, 0, cw, ch);
  ctx.imageSmoothingQuality = "high";

  const ar = img.naturalWidth / img.naturalHeight;
  // Paysage sur écran haut : le cadre déborde un peu sur les côtés, à taille réelle.
  const paysage = cw / ch < ar;
  const w = paysage ? cw * (1.4 + 0.3 * progress) : ch * (0.8 + 0.2 * progress) * ar;
  const h = w / ar;
  const x = (cw - w) / 2, y = (ch - h) / 2;
  ctx.drawImage(img, x, y, w, h);

  // Traits de construction : ils dépassent du cadre comme sur le logo.
  const over = 28 * dpr * (1 - progress);
  if (over < 1) return;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = dpr;
  ctx.beginPath();
  for (const yy of [y - 0.5, y + h + 0.5]) {
    ctx.moveTo(x - over * 2, yy);
    ctx.lineTo(x + w + over * 2, yy);
  }
  for (const xx of [x - 0.5, x + w + 0.5]) {
    ctx.moveTo(xx, y - over);
    ctx.lineTo(xx, y + h + over);
  }
  ctx.stroke();
}
