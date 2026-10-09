export type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function maskStrengthAt(
  maskData: ImageData,
  pixelIndex: number,
): number {
  const i = pixelIndex * 4;
  const maskR = maskData.data[i] ?? 0;
  const maskG = maskData.data[i + 1] ?? 0;
  const maskB = maskData.data[i + 2] ?? 0;
  const maskA = maskData.data[i + 3] ?? 0;
  const luminance = (maskR + maskG + maskB) / (3 * 255);
  return (maskA / 255) * luminance;
}

export function combinedMaskStrengthAt(
  maskDatas: ImageData[],
  pixelIndex: number,
): number {
  let strength = 0;

  for (const maskData of maskDatas) {
    strength = Math.max(strength, maskStrengthAt(maskData, pixelIndex));
  }

  return strength;
}

function pixelLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function relativeLuminanceRgb(r: number, g: number, b: number): number {
  const toLinear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  );
}

/**
 * Estimates NEXUS lettering within the sole insert from source pixels (no extra assets).
 */
export function buildLetteringAlphaMap(
  baseData: ImageData,
  soleInsertMask: ImageData,
): Float32Array {
  const pixelCount = baseData.width * baseData.height;
  const lettering = new Float32Array(pixelCount);
  const fillSamples: number[] = [];

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const insertStrength = maskStrengthAt(soleInsertMask, pixel);

    if (insertStrength < 0.35) {
      continue;
    }

    const i = pixel * 4;
    const r = baseData.data[i] ?? 0;
    const g = baseData.data[i + 1] ?? 0;
    const b = baseData.data[i + 2] ?? 0;
    const luminance = pixelLuminance(r, g, b);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max > 0 ? (max - min) / max : 0;

    if (luminance >= 0.22 && luminance <= 0.52 && saturation < 0.55) {
      fillSamples.push(luminance);
    }
  }

  fillSamples.sort((a, b) => a - b);
  const fillLuminance =
    fillSamples.length > 0
      ? fillSamples[Math.floor(fillSamples.length / 2)] ?? 0.38
      : 0.38;

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const insertStrength = maskStrengthAt(soleInsertMask, pixel);

    if (insertStrength < 0.08) {
      continue;
    }

    const i = pixel * 4;
    const r = baseData.data[i] ?? 0;
    const g = baseData.data[i + 1] ?? 0;
    const b = baseData.data[i + 2] ?? 0;
    const luminance = pixelLuminance(r, g, b);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max > 0 ? (max - min) / max : 0;

    const deltaFromFill = Math.abs(luminance - fillLuminance);
    let letterScore = 0;

    if (luminance >= 0.58 && saturation < 0.45) {
      letterScore = Math.min(1, (luminance - 0.52) / 0.28);
    } else if (deltaFromFill >= 0.1) {
      letterScore = Math.min(1, (deltaFromFill - 0.08) / 0.22);
    }

    const x = pixel % baseData.width;

    if (letterScore < 0.35 && x > 0 && x < baseData.width - 1) {
      const neighbors = [
        pixel - 1,
        pixel + 1,
        pixel - baseData.width,
        pixel + baseData.width,
      ];
      let localContrast = 0;

      for (const neighbor of neighbors) {
        if (neighbor < 0 || neighbor >= pixelCount) {
          continue;
        }

        const ni = neighbor * 4;
        const neighborL = pixelLuminance(
          baseData.data[ni] ?? 0,
          baseData.data[ni + 1] ?? 0,
          baseData.data[ni + 2] ?? 0,
        );
        localContrast = Math.max(localContrast, Math.abs(luminance - neighborL));
      }

      if (localContrast >= 0.07) {
        letterScore = Math.max(letterScore, Math.min(1, localContrast / 0.16));
      }
    }

    if (letterScore > 0.12) {
      lettering[pixel] = Math.min(1, letterScore * insertStrength);
    }
  }

  return lettering;
}

function adaptiveLetterRgb(
  target: Rgb,
  sourceR: number,
  sourceG: number,
  sourceB: number,
): Rgb {
  const useLightLettering = relativeLuminanceRgb(target.r, target.g, target.b) < 0.45;
  const emboss = pixelLuminance(sourceR, sourceG, sourceB);
  const embossNorm = Math.max(0, Math.min(1, (emboss - 0.15) / 0.75));

  if (useLightLettering) {
    const base = 228 + embossNorm * 24;
    return { r: base, g: base + 2, b: base + 6 };
  }

  const base = 22 + embossNorm * 48;
  return { r: base, g: base + 4, b: base + 10 };
}

type MaskedRecolorOptions = {
  letteringAlpha?: Float32Array;
  /** Earlier groups in the pipeline; their mask strength reduces effective strength here. */
  excludeMaskDatas?: ImageData[];
  /** Preserves mesh/perforation on bright uppers; improves dark target shading. */
  materialProfile?: "brightUpper" | "brightMidsole";
};

function shadedTargetMultiplier(
  target: Rgb,
  sourceLuminance: number,
  materialProfile?: MaskedRecolorOptions["materialProfile"],
): number {
  const darkTarget = relativeLuminanceRgb(target.r, target.g, target.b) < 0.22;

  if (materialProfile === "brightUpper") {
    return darkTarget
      ? 0.16 + sourceLuminance * 0.84
      : 0.26 + sourceLuminance * 0.86;
  }

  if (materialProfile === "brightMidsole") {
    return darkTarget
      ? 0.14 + sourceLuminance * 0.86
      : 0.24 + sourceLuminance * 0.88;
  }

  return 0.35 + sourceLuminance * 0.85;
}

function highlightPreserveFactor(
  luminance: number,
  materialProfile?: MaskedRecolorOptions["materialProfile"],
): number {
  if (materialProfile === "brightUpper" && luminance > 0.78) {
    return Math.min(0.38, ((luminance - 0.78) / 0.22) * 0.38);
  }

  if (materialProfile === "brightMidsole" && luminance > 0.74) {
    return Math.min(0.42, ((luminance - 0.74) / 0.26) * 0.42);
  }

  return 0;
}

/**
 * Recolors masked regions on a source image, preserving luminance (and optional lettering).
 */
export function applyMaskedRegionsRecolor(
  sourceData: ImageData,
  maskDatas: ImageData[],
  targetHex: string,
  options?: MaskedRecolorOptions,
): ImageData {
  const letteringAlpha = options?.letteringAlpha;
  const target = hexToRgb(targetHex);
  const output = new ImageData(
    new Uint8ClampedArray(sourceData.data),
    sourceData.width,
    sourceData.height,
  );
  const pixelCount = sourceData.width * sourceData.height;

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const rawStrength = combinedMaskStrengthAt(maskDatas, pixel);
    const excludeStrength = options?.excludeMaskDatas
      ? combinedMaskStrengthAt(options.excludeMaskDatas, pixel)
      : 0;
    const strength = rawStrength * (1 - Math.min(1, excludeStrength));

    if (strength < 0.06) {
      continue;
    }

    const i = pixel * 4;
    const sourceR = sourceData.data[i] ?? 0;
    const sourceG = sourceData.data[i + 1] ?? 0;
    const sourceB = sourceData.data[i + 2] ?? 0;
    const luminance = pixelLuminance(sourceR, sourceG, sourceB);
    const shaded = shadedTargetMultiplier(
      target,
      luminance,
      options?.materialProfile,
    );

    const recolorR = target.r * shaded;
    const recolorG = target.g * shaded;
    const recolorB = target.b * shaded;

    const letterStrength = letteringAlpha?.[pixel] ?? 0;
    let bodyStrength = strength * (1 - letterStrength * 0.92);

    const highlightPreserve = highlightPreserveFactor(
      luminance,
      options?.materialProfile,
    );
    bodyStrength *= 1 - highlightPreserve;

    let outR = sourceR * (1 - bodyStrength) + recolorR * bodyStrength;
    let outG = sourceG * (1 - bodyStrength) + recolorG * bodyStrength;
    let outB = sourceB * (1 - bodyStrength) + recolorB * bodyStrength;

    if (letterStrength > 0.08) {
      const letter = adaptiveLetterRgb(target, sourceR, sourceG, sourceB);
      const letterMix = letterStrength * Math.min(1, strength * 1.05);
      outR = outR * (1 - letterMix) + letter.r * letterMix;
      outG = outG * (1 - letterMix) + letter.g * letterMix;
      outB = outB * (1 - letterMix) + letter.b * letterMix;
    }

    output.data[i] = clampByte(outR);
    output.data[i + 1] = clampByte(outG);
    output.data[i + 2] = clampByte(outB);
    output.data[i + 3] = sourceData.data[i + 3] ?? 255;
  }

  return output;
}

export type LabPreviewComposeInput = {
  baseData: ImageData;
  baseUpperMaskDatas: ImageData[];
  midsoleMaskDatas: ImageData[];
  midsoleExcludeMaskDatas: ImageData[];
  blueMaskDatas: ImageData[];
  orangeMaskDatas: ImageData[];
  purpleMaskDatas: ImageData[];
  baseUpperTargetHex: string | null;
  midsoleTargetHex: string | null;
  blueTargetHex: string | null;
  orangeTargetHex: string | null;
  purpleTargetHex: string | null;
  letteringAlpha: Float32Array;
};

/**
 * Applies base → midsole → blue → orange → purple. On overlap, earlier groups win
 * (later groups use reduced strength where earlier masks are active).
 * Midsole excludes insert/upper/outsole masks so the foam stays independent.
 */
export function composeLabPreviewImage(input: LabPreviewComposeInput): ImageData {
  const {
    baseData,
    baseUpperMaskDatas,
    midsoleMaskDatas,
    midsoleExcludeMaskDatas,
    blueMaskDatas,
    orangeMaskDatas,
    purpleMaskDatas,
    baseUpperTargetHex,
    midsoleTargetHex,
    blueTargetHex,
    orangeTargetHex,
    purpleTargetHex,
    letteringAlpha,
  } = input;

  let current = new ImageData(
    new Uint8ClampedArray(baseData.data),
    baseData.width,
    baseData.height,
  );

  if (baseUpperTargetHex) {
    current = applyMaskedRegionsRecolor(
      current,
      baseUpperMaskDatas,
      baseUpperTargetHex,
      { materialProfile: "brightUpper" },
    );
  }

  if (midsoleTargetHex) {
    current = applyMaskedRegionsRecolor(
      current,
      midsoleMaskDatas,
      midsoleTargetHex,
      {
        materialProfile: "brightMidsole",
        excludeMaskDatas: midsoleExcludeMaskDatas,
      },
    );
  }

  if (blueTargetHex) {
    current = applyMaskedRegionsRecolor(current, blueMaskDatas, blueTargetHex, {
      letteringAlpha,
    });
  }

  if (orangeTargetHex) {
    current = applyMaskedRegionsRecolor(
      current,
      orangeMaskDatas,
      orangeTargetHex,
      { excludeMaskDatas: blueMaskDatas },
    );
  }

  if (purpleTargetHex) {
    current = applyMaskedRegionsRecolor(
      current,
      purpleMaskDatas,
      purpleTargetHex,
      {
        excludeMaskDatas: [...blueMaskDatas, ...orangeMaskDatas],
      },
    );
  }

  return current;
}

/** Recolors blue detail masks with NEXUS lettering handling. */
export function applyBlueRegionsRecolor(
  baseData: ImageData,
  maskDatas: ImageData[],
  targetHex: string,
  letteringAlpha: Float32Array,
): ImageData {
  return applyMaskedRegionsRecolor(baseData, maskDatas, targetHex, {
    letteringAlpha,
  });
}

/** @deprecated Use applyBlueRegionsRecolor with a single mask. */
export function applySoleRecolor(
  baseData: ImageData,
  maskData: ImageData,
  targetHex: string,
): ImageData {
  return applyBlueRegionsRecolor(
    baseData,
    [maskData],
    targetHex,
    new Float32Array(baseData.width * baseData.height),
  );
}

export function buildGroupMaskDebugImage(
  maskDatas: ImageData[],
  width: number,
  height: number,
  tint: { r: number; g: number; b: number },
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  const pixelCount = width * height;

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const strength = combinedMaskStrengthAt(maskDatas, pixel);

    if (strength < 0.04) {
      continue;
    }

    const i = pixel * 4;
    const alpha = clampByte(strength * 185);
    data[i] = tint.r;
    data[i + 1] = tint.g;
    data[i + 2] = tint.b;
    data[i + 3] = alpha;
  }

  return new ImageData(data, width, height);
}

export function buildDualGroupMaskDebugImage(
  blueMaskDatas: ImageData[],
  orangeMaskDatas: ImageData[],
  width: number,
  height: number,
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  const pixelCount = width * height;
  const blueTint = { r: 226, g: 58, b: 255 };
  const orangeTint = { r: 72, g: 255, b: 130 };

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const blueStrength = combinedMaskStrengthAt(blueMaskDatas, pixel);
    const orangeStrength = combinedMaskStrengthAt(orangeMaskDatas, pixel);

    if (blueStrength < 0.04 && orangeStrength < 0.04) {
      continue;
    }

    const totalStrength = blueStrength + orangeStrength || 1;
    const blueWeight = blueStrength / totalStrength;
    const orangeWeight = orangeStrength / totalStrength;
    const i = pixel * 4;
    const alpha = clampByte(Math.max(blueStrength, orangeStrength) * 185);

    data[i] = clampByte(blueTint.r * blueWeight + orangeTint.r * orangeWeight);
    data[i + 1] = clampByte(
      blueTint.g * blueWeight + orangeTint.g * orangeWeight,
    );
    data[i + 2] = clampByte(
      blueTint.b * blueWeight + orangeTint.b * orangeWeight,
    );
    data[i + 3] = alpha;
  }

  return new ImageData(data, width, height);
}

export type LabMaskDebugGroup = {
  maskDatas: ImageData[];
  tint: { r: number; g: number; b: number };
};

export function buildLabMaskDebugImage(
  groups: LabMaskDebugGroup[],
  width: number,
  height: number,
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  const pixelCount = width * height;

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const strengths = groups.map((group) =>
      combinedMaskStrengthAt(group.maskDatas, pixel),
    );
    const maxStrength = Math.max(...strengths, 0);

    if (maxStrength < 0.04) {
      continue;
    }

    const totalStrength = strengths.reduce((sum, value) => sum + value, 0) || 1;
    let r = 0;
    let g = 0;
    let b = 0;

    for (let index = 0; index < groups.length; index += 1) {
      const weight = (strengths[index] ?? 0) / totalStrength;
      const tint = groups[index]?.tint;
      if (!tint) {
        continue;
      }

      r += tint.r * weight;
      g += tint.g * weight;
      b += tint.b * weight;
    }

    const i = pixel * 4;
    data[i] = clampByte(r);
    data[i + 1] = clampByte(g);
    data[i + 2] = clampByte(b);
    data[i + 3] = clampByte(maxStrength * 185);
  }

  return new ImageData(data, width, height);
}

/** @deprecated Use buildLabMaskDebugImage */
export function buildTripleGroupMaskDebugImage(
  blueMaskDatas: ImageData[],
  orangeMaskDatas: ImageData[],
  purpleMaskDatas: ImageData[],
  width: number,
  height: number,
): ImageData {
  return buildLabMaskDebugImage(
    [
      { maskDatas: blueMaskDatas, tint: { r: 226, g: 58, b: 255 } },
      { maskDatas: orangeMaskDatas, tint: { r: 72, g: 255, b: 130 } },
      { maskDatas: purpleMaskDatas, tint: { r: 255, g: 232, b: 72 } },
    ],
    width,
    height,
  );
}

/** @deprecated Use buildGroupMaskDebugImage or buildDualGroupMaskDebugImage */
export function buildCombinedMaskDebugImage(
  maskDatas: ImageData[],
  width: number,
  height: number,
): ImageData {
  return buildGroupMaskDebugImage(maskDatas, width, height, {
    r: 226,
    g: 58,
    b: 255,
  });
}

export function drawImageToCanvas(
  canvas: HTMLCanvasElement,
  image: CanvasImageSource,
  width: number,
  height: number,
): CanvasRenderingContext2D | null {
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return context;
}

export function readCanvasPixels(
  canvas: HTMLCanvasElement,
): ImageData | null {
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  return context.getImageData(0, 0, canvas.width, canvas.height);
}
