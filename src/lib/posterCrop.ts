/**
 * Analyzes a poster image to find the vertical center of the main title text
 * and returns the object-position value that centers it in a 5:1 viewport.
 *
 * The title is the brightest large horizontal band in the poster.
 */

const CONTAINER_RATIO = 5; // 5:1 hero container

/**
 * Given a poster's natural height and the detected title-center row (in px from top),
 * returns the object-position Y percentage that centers that row in the viewport.
 */
export function titleToObjectPosition(
  imgNaturalHeight: number,
  titleCenterRow: number,
): string {
  // object-cover scale for a 5:1 container with a ~1.41:1 poster
  // scale = max(containerW/posterW, containerH/posterH)
  // Normalised: container = 1000 × 200, poster = naturalW × naturalH
  const posterAspect = 1.41; // all posters ~1.41
  const containerW = 1000;
  const containerH = containerW / CONTAINER_RATIO;
  const scale = Math.max(containerW / (posterAspect * imgNaturalHeight), containerH / imgNaturalHeight);
  const scaledH = imgNaturalHeight * scale;
  const overflow = scaledH - containerH;

  // object-position Y% = (topCrop) / overflow
  // where topCrop = titleCenterRow*scale - containerH/2
  const titleInScaled = titleCenterRow * scale;
  const topCrop = titleInScaled - containerH / 2;

  const yPercent = Math.max(0, Math.min(100, (topCrop / overflow) * 100));
  return `50% ${yPercent.toFixed(1)}%`;
}

/**
 * Detect the row (in natural image pixels from the top) of the brightest
 * contiguous horizontal band — typically the main category title.
 *
 * Works by scanning every Nth row, counting "bright" pixels (> brightness threshold),
 * and finding the row with the most bright pixels within a contiguous bright region.
 */
export function detectTitleRow(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
): number {
  const w = canvas.width;
  const h = canvas.height;
  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const BRIGHT_THRESHOLD = 200; // near-white pixels
  const STEP = 2; // sample every 2nd row for speed

  // Count bright pixels per row
  const rowBright: number[] = new Array(h).fill(0);
  for (let y = 0; y < h; y += STEP) {
    let count = 0;
    for (let x = 0; x < w; x += 3) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Check for bright pixels (title text is usually white/bright)
      if (r > BRIGHT_THRESHOLD && g > BRIGHT_THRESHOLD && b > BRIGHT_THRESHOLD) {
        count++;
      }
    }
    rowBright[y] = count;
    // Fill skipped rows
    if (STEP > 1 && y + 1 < h) rowBright[y + 1] = count;
  }

  // Find the brightest contiguous band (the title region)
  // Use a sliding window of ~10% of image height
  const windowSize = Math.max(10, Math.floor(h * 0.08));
  let bestSum = 0;
  let bestStart = 0;

  for (let y = 0; y < h - windowSize; y += STEP) {
    let sum = 0;
    for (let dy = 0; dy < windowSize; dy += STEP) {
      sum += rowBright[y + dy];
    }
    if (sum > bestSum) {
      bestSum = sum;
      bestStart = y;
    }
  }

  // Title center is at the middle of the brightest band
  const titleCenter = bestStart + windowSize / 2;

  // Fallback: if no bright band found, return image center
  if (bestSum === 0) return Math.floor(h / 2);

  return Math.floor(titleCenter);
}

/**
 * Preload an image and return its natural dimensions.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
