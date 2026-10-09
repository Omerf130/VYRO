"use client";

import { useEffect, useRef, useState } from "react";
import {
  getVyroLabRecolorGroup,
  getVyroLabRegionForGroup,
  vyroLabRecolorGroupOrder,
  type VyroLabPreviewConfig,
  type VyroLabRecolorGroupConfig,
  type VyroLabRegionConfig,
} from "@/data/vyro-lab";
import { vyroLabMaskDebugEnabled } from "@/lib/vyro-lab/debug";
import {
  buildLabMaskDebugImage,
  buildLetteringAlphaMap,
  composeLabPreviewImage,
  drawImageToCanvas,
  loadImageElement,
  readCanvasPixels,
} from "@/lib/vyro-lab/recolor-sole";

type UseSoleRecolorCanvasOptions = {
  config: VyroLabPreviewConfig;
  selectedUpperSwatchId: string;
  selectedMidsoleSwatchId: string;
  selectedSoleSwatchId: string;
  selectedAccentSwatchId: string;
  selectedPurpleSwatchId: string;
};

type PreparedLabAssets = {
  baseImage: HTMLImageElement;
  baseData: ImageData;
  baseUpperMaskDatas: ImageData[];
  midsoleMaskDatas: ImageData[];
  midsoleExcludeMaskDatas: ImageData[];
  blueMaskDatas: ImageData[];
  orangeMaskDatas: ImageData[];
  purpleMaskDatas: ImageData[];
  letteringAlpha: Float32Array;
  width: number;
  height: number;
};

function resolveSwatchColor(
  region: VyroLabRegionConfig,
  swatchId: string,
): string | null {
  return region.swatches.find((swatch) => swatch.id === swatchId)?.color ?? null;
}

function maskDataForId(
  group: VyroLabRecolorGroupConfig,
  maskDatas: ImageData[],
  maskId: string,
): ImageData | undefined {
  const index = group.masks.findIndex((mask) => mask.id === maskId);
  return index >= 0 ? maskDatas[index] : undefined;
}

export function useSoleRecolorCanvas({
  config,
  selectedUpperSwatchId,
  selectedMidsoleSwatchId,
  selectedSoleSwatchId,
  selectedAccentSwatchId,
  selectedPurpleSwatchId,
}: UseSoleRecolorCanvasOptions) {
  const stackRef = useRef<HTMLDivElement>(null);
  const recolorCanvasRef = useRef<HTMLCanvasElement>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement>(null);
  const preparedRef = useRef<PreparedLabAssets | null>(null);
  const composedBitmapRef = useRef<ImageBitmap | null>(null);
  const debugMaskBitmapRef = useRef<ImageBitmap | null>(null);
  const composeScratchRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [composedRevision, setComposedRevision] = useState(0);

  const baseGroup = getVyroLabRecolorGroup(config, "baseColor");
  const midsoleGroup = getVyroLabRecolorGroup(config, "midsoleFoam");
  const blueGroup = getVyroLabRecolorGroup(config, "blueDetails");
  const orangeGroup = getVyroLabRecolorGroup(config, "orangeAccents");
  const purpleGroup = getVyroLabRecolorGroup(config, "purplePanels");

  useEffect(() => {
    let cancelled = false;

    async function prepareAssets() {
      try {
        const allMaskSources = vyroLabRecolorGroupOrder.flatMap((groupId) =>
          getVyroLabRecolorGroup(config, groupId).masks.map((mask) => mask.src),
        );

        const [baseImage, ...maskImages] = await Promise.all([
          loadImageElement(config.sneakerImage.src),
          ...allMaskSources.map((src) => loadImageElement(src)),
        ]);

        if (cancelled) {
          return;
        }

        const { width, height } = config.sneakerImage;
        const scratch = document.createElement("canvas");
        drawImageToCanvas(scratch, baseImage, width, height);
        const baseData = readCanvasPixels(scratch);

        if (!baseData) {
          return;
        }

        const maskDatas = maskImages.map((maskImage) => {
          const maskCanvas = document.createElement("canvas");
          drawImageToCanvas(maskCanvas, maskImage, width, height);
          return readCanvasPixels(maskCanvas);
        });

        if (maskDatas.some((maskData) => !maskData)) {
          return;
        }

        const validMaskDatas = maskDatas as ImageData[];
        let maskOffset = 0;

        const sliceGroupMasks = (count: number) => {
          const slice = validMaskDatas.slice(maskOffset, maskOffset + count);
          maskOffset += count;
          return slice;
        };

        const baseUpperMaskDatas = sliceGroupMasks(baseGroup.masks.length);
        const midsoleMaskDatas = sliceGroupMasks(midsoleGroup.masks.length);
        const blueMaskDatas = sliceGroupMasks(blueGroup.masks.length);
        const orangeMaskDatas = sliceGroupMasks(orangeGroup.masks.length);
        const purpleMaskDatas = sliceGroupMasks(purpleGroup.masks.length);

        const soleInsertMask = maskDataForId(
          blueGroup,
          blueMaskDatas,
          "soleInsert",
        );

        if (!soleInsertMask) {
          return;
        }

        const midsoleExcludeMaskDatas = [
          ...baseUpperMaskDatas,
          soleInsertMask,
          maskDataForId(blueGroup, blueMaskDatas, "outsole"),
          maskDataForId(orangeGroup, orangeMaskDatas, "orangeOutsole"),
          maskDataForId(purpleGroup, purpleMaskDatas, "purpleOutsole"),
        ].filter((maskData): maskData is ImageData => Boolean(maskData));

        const letteringAlpha = buildLetteringAlphaMap(baseData, soleInsertMask);

        composedBitmapRef.current?.close();
        debugMaskBitmapRef.current?.close();

        const debugImage = buildLabMaskDebugImage(
          [
            {
              maskDatas: baseUpperMaskDatas,
              tint: { r: 168, g: 216, b: 255 },
            },
            {
              maskDatas: midsoleMaskDatas,
              tint: { r: 255, g: 176, b: 112 },
            },
            {
              maskDatas: blueMaskDatas,
              tint: { r: 226, g: 58, b: 255 },
            },
            {
              maskDatas: orangeMaskDatas,
              tint: { r: 72, g: 255, b: 130 },
            },
            {
              maskDatas: purpleMaskDatas,
              tint: { r: 255, g: 232, b: 72 },
            },
          ],
          width,
          height,
        );

        const debugScratch = document.createElement("canvas");
        const debugContext = debugScratch.getContext("2d");
        if (debugContext) {
          debugScratch.width = width;
          debugScratch.height = height;
          debugContext.putImageData(debugImage, 0, 0);
          debugMaskBitmapRef.current = await createImageBitmap(debugScratch);
        }

        preparedRef.current = {
          baseImage,
          baseData,
          baseUpperMaskDatas,
          midsoleMaskDatas,
          midsoleExcludeMaskDatas,
          blueMaskDatas,
          orangeMaskDatas,
          purpleMaskDatas,
          letteringAlpha,
          width,
          height,
        };
        composeScratchRef.current = scratch;

        if (cancelled) {
          preparedRef.current = null;
          debugMaskBitmapRef.current?.close();
          debugMaskBitmapRef.current = null;
          return;
        }

        setIsReady(true);
      } catch {
        setIsReady(false);
      }
    }

    prepareAssets();

    return () => {
      cancelled = true;
      preparedRef.current = null;
      composedBitmapRef.current?.close();
      composedBitmapRef.current = null;
      debugMaskBitmapRef.current?.close();
      debugMaskBitmapRef.current = null;
      composeScratchRef.current = null;
    };
    // Asset paths and mask counts are defined by static preview config.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- config
  }, [config]);

  const isFactoryPreview =
    selectedUpperSwatchId === baseGroup.factorySwatchId &&
    selectedMidsoleSwatchId === midsoleGroup.factorySwatchId &&
    selectedSoleSwatchId === blueGroup.factorySwatchId &&
    selectedAccentSwatchId === orangeGroup.factorySwatchId &&
    selectedPurpleSwatchId === purpleGroup.factorySwatchId;

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let cancelled = false;

    async function composeSelection() {
      const preparedAssets = preparedRef.current;
      const composeScratch = composeScratchRef.current;

      if (!preparedAssets || !composeScratch) {
        return;
      }

      composedBitmapRef.current?.close();
      composedBitmapRef.current = null;

      if (isFactoryPreview) {
        setComposedRevision((value) => value + 1);
        return;
      }

      const upperRegion = getVyroLabRegionForGroup(config, baseGroup);
      const midsoleRegion = getVyroLabRegionForGroup(config, midsoleGroup);
      const soleRegion = getVyroLabRegionForGroup(config, blueGroup);
      const accentRegion = getVyroLabRegionForGroup(config, orangeGroup);
      const purpleRegion = getVyroLabRegionForGroup(config, purpleGroup);

      const baseUpperTargetHex =
        selectedUpperSwatchId === baseGroup.factorySwatchId
          ? null
          : resolveSwatchColor(upperRegion, selectedUpperSwatchId);
      const midsoleTargetHex =
        selectedMidsoleSwatchId === midsoleGroup.factorySwatchId
          ? null
          : resolveSwatchColor(midsoleRegion, selectedMidsoleSwatchId);
      const blueTargetHex =
        selectedSoleSwatchId === blueGroup.factorySwatchId
          ? null
          : resolveSwatchColor(soleRegion, selectedSoleSwatchId);
      const orangeTargetHex =
        selectedAccentSwatchId === orangeGroup.factorySwatchId
          ? null
          : resolveSwatchColor(accentRegion, selectedAccentSwatchId);
      const purpleTargetHex =
        selectedPurpleSwatchId === purpleGroup.factorySwatchId
          ? null
          : resolveSwatchColor(purpleRegion, selectedPurpleSwatchId);

      const composed = composeLabPreviewImage({
        baseData: preparedAssets.baseData,
        baseUpperMaskDatas: preparedAssets.baseUpperMaskDatas,
        midsoleMaskDatas: preparedAssets.midsoleMaskDatas,
        midsoleExcludeMaskDatas: preparedAssets.midsoleExcludeMaskDatas,
        blueMaskDatas: preparedAssets.blueMaskDatas,
        orangeMaskDatas: preparedAssets.orangeMaskDatas,
        purpleMaskDatas: preparedAssets.purpleMaskDatas,
        baseUpperTargetHex,
        midsoleTargetHex,
        blueTargetHex,
        orangeTargetHex,
        purpleTargetHex,
        letteringAlpha: preparedAssets.letteringAlpha,
      });

      const context = composeScratch.getContext("2d");
      if (!context) {
        return;
      }

      context.putImageData(composed, 0, 0);

      if (cancelled) {
        return;
      }

      composedBitmapRef.current = await createImageBitmap(composeScratch);
      setComposedRevision((value) => value + 1);
    }

    composeSelection();

    return () => {
      cancelled = true;
    };
  }, [
    baseGroup,
    blueGroup,
    config,
    isFactoryPreview,
    isReady,
    midsoleGroup,
    orangeGroup,
    purpleGroup,
    selectedAccentSwatchId,
    selectedMidsoleSwatchId,
    selectedPurpleSwatchId,
    selectedSoleSwatchId,
    selectedUpperSwatchId,
  ]);

  useEffect(() => {
    const stack = stackRef.current;
    const canvas = recolorCanvasRef.current;

    if (!stack || !canvas || !isReady) {
      return;
    }

    const bitmap = composedBitmapRef.current;

    const paint = () => {
      const displayWidth = stack.clientWidth;
      const displayHeight = stack.clientHeight;

      if (displayWidth <= 0 || displayHeight <= 0) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!isFactoryPreview && bitmap) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      }
    };

    paint();

    const observer = new ResizeObserver(paint);
    observer.observe(stack);

    return () => observer.disconnect();
  }, [
    composedRevision,
    isFactoryPreview,
    isReady,
    selectedAccentSwatchId,
    selectedMidsoleSwatchId,
    selectedPurpleSwatchId,
    selectedSoleSwatchId,
    selectedUpperSwatchId,
  ]);

  useEffect(() => {
    if (!vyroLabMaskDebugEnabled || !isReady) {
      return;
    }

    const stack = stackRef.current;
    const canvas = debugCanvasRef.current;
    const debugBitmap = debugMaskBitmapRef.current;

    if (!stack || !canvas || !debugBitmap) {
      return;
    }

    const paint = () => {
      const displayWidth = stack.clientWidth;
      const displayHeight = stack.clientHeight;

      if (displayWidth <= 0 || displayHeight <= 0) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(debugBitmap, 0, 0, canvas.width, canvas.height);
    };

    paint();

    const observer = new ResizeObserver(paint);
    observer.observe(stack);

    return () => observer.disconnect();
  }, [isReady]);

  const showRecolorLayer = isReady && !isFactoryPreview;

  return {
    stackRef,
    recolorCanvasRef,
    debugCanvasRef,
    showRecolorLayer,
    maskDebugEnabled: vyroLabMaskDebugEnabled && isReady,
  };
}
