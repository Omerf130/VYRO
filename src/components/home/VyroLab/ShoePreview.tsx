"use client";

import Image from "next/image";
import type { VyroLabPreviewConfig } from "@/data/vyro-lab";
import { useSoleRecolorCanvas } from "./useSoleRecolorCanvas";
import styles from "./VyroLabSection.module.scss";

type ShoePreviewProps = {
  config: VyroLabPreviewConfig;
  selectedUpperSwatchId: string;
  selectedMidsoleSwatchId: string;
  selectedSoleSwatchId: string;
  selectedAccentSwatchId: string;
  selectedPurpleSwatchId: string;
};

export function ShoePreview({
  config,
  selectedUpperSwatchId,
  selectedMidsoleSwatchId,
  selectedSoleSwatchId,
  selectedAccentSwatchId,
  selectedPurpleSwatchId,
}: ShoePreviewProps) {
  const { sneakerImage } = config;

  const {
    stackRef,
    recolorCanvasRef,
    debugCanvasRef,
    showRecolorLayer,
    maskDebugEnabled,
  } = useSoleRecolorCanvas({
    config,
    selectedUpperSwatchId,
    selectedMidsoleSwatchId,
    selectedSoleSwatchId,
    selectedAccentSwatchId,
    selectedPurpleSwatchId,
  });

  return (
    <div className={styles.previewStage}>
      <div className={styles.previewEnvironment} aria-hidden>
        <div className={styles.glowCore} />
        <div className={styles.glowBlue} />
        <div className={styles.glowPurple} />
        <div className={styles.glowMagenta} />
        <div className={styles.glowOrange} />
        <div className={styles.lightFlareA} />
        <div className={styles.lightFlareB} />
        <div className={styles.lightPlatform}>
          <div className={styles.platformPool} />
          <div className={styles.platformLines} />
        </div>
        <div className={styles.gridFloor} />
        <div className={styles.gridWall} />
        <div className={styles.lightStreak} />
      </div>

      <svg
        className={styles.energyTrails}
        viewBox="0 0 480 320"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <filter
            id="vyroLabTrailGlow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="vyroLabTrailA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087bff" stopOpacity="0" />
            <stop offset="42%" stopColor="#087bff" stopOpacity="1" />
            <stop offset="100%" stopColor="#873bff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vyroLabTrailB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#873bff" stopOpacity="0" />
            <stop offset="48%" stopColor="#e23aff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff651d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vyroLabTrailC" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff651d" stopOpacity="0" />
            <stop offset="50%" stopColor="#087bff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e23aff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vyroLabTrailD" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#e23aff" stopOpacity="0" />
            <stop offset="55%" stopColor="#873bff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#087bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className={styles.trailGlowLayer} filter="url(#vyroLabTrailGlow)">
          <path
            d="M 12 176 Q 128 78 272 108 T 468 82"
            fill="none"
            stroke="url(#vyroLabTrailA)"
            strokeWidth="5.5"
            opacity="0.55"
          />
          <path
            d="M 24 228 Q 156 268 292 204 T 468 232"
            fill="none"
            stroke="url(#vyroLabTrailB)"
            strokeWidth="4.5"
            opacity="0.5"
          />
          <path
            d="M 56 118 Q 188 158 318 132 T 472 148"
            fill="none"
            stroke="url(#vyroLabTrailC)"
            strokeWidth="4"
            opacity="0.48"
          />
        </g>
        <g className={styles.trailCoreLayer}>
          <path
            className={styles.trailPath}
            d="M 12 176 Q 128 78 272 108 T 468 82"
            fill="none"
            stroke="url(#vyroLabTrailA)"
            strokeWidth="2.75"
          />
          <path
            className={styles.trailPath}
            d="M 24 228 Q 156 268 292 204 T 468 232"
            fill="none"
            stroke="url(#vyroLabTrailB)"
            strokeWidth="2.25"
          />
          <path
            className={styles.trailPath}
            d="M 56 118 Q 188 158 318 132 T 472 148"
            fill="none"
            stroke="url(#vyroLabTrailC)"
            strokeWidth="2"
          />
          <path
            className={styles.trailPath}
            d="M 80 148 Q 210 188 340 168 T 460 178"
            fill="none"
            stroke="url(#vyroLabTrailD)"
            strokeWidth="1.65"
            opacity="0.85"
          />
        </g>
      </svg>

      <div className={styles.shoeFloatWrap}>
        <div className={styles.shoeStack} ref={stackRef}>
          <Image
            src={sneakerImage.src}
            alt={sneakerImage.alt}
            width={sneakerImage.width}
            height={sneakerImage.height}
            className={styles.shoeImage}
            sizes="(max-width: 767px) 92vw, (max-width: 1023px) 58vw, 48vw"
            priority={false}
          />
          <canvas
            ref={recolorCanvasRef}
            className={`${styles.shoeRecolorCanvas} ${showRecolorLayer ? styles.shoeRecolorCanvasVisible : ""}`}
            aria-hidden
          />
          {maskDebugEnabled ? (
            <canvas
              ref={debugCanvasRef}
              className={styles.maskDebugCanvas}
              aria-hidden
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
