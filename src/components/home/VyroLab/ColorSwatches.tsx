"use client";

import type { CSSProperties } from "react";
import type { VyroLabRegionConfig } from "@/data/vyro-lab";
import styles from "./VyroLabSection.module.scss";

type ColorSwatchesProps = {
  region: VyroLabRegionConfig;
  interactive?: boolean;
  selectedSwatchId?: string;
  onSelect?: (swatchId: string) => void;
};

export function ColorSwatches({
  region,
  interactive = false,
  selectedSwatchId,
  onSelect,
}: ColorSwatchesProps) {
  const isInteractiveRegion =
    interactive &&
    (region.id === "upper" ||
      region.id === "midsole" ||
      region.id === "sole" ||
      region.id === "accent" ||
      region.id === "purplePanels");
  const activeId = selectedSwatchId ?? region.defaultSwatchId;

  return (
    <fieldset
      className={styles.swatchGroup}
      disabled={!isInteractiveRegion}
      aria-disabled={!isInteractiveRegion}
    >
      <legend className={styles.swatchLegend}>{region.label}</legend>
      <ul
        className={styles.swatchList}
        role={isInteractiveRegion ? "radiogroup" : undefined}
        aria-label={`${region.label} color options`}
      >
        {region.swatches.map((swatch) => {
          const isSelected = swatch.id === activeId;

          if (isInteractiveRegion) {
            return (
              <li key={swatch.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={swatch.label}
                  className={`${styles.swatchButton} ${isSelected ? styles.swatchSelected : ""}`}
                  onClick={() => onSelect?.(swatch.id)}
                >
                  <span
                    className={styles.swatchDot}
                    style={
                      { "--swatch-color": swatch.color } as CSSProperties
                    }
                    aria-hidden
                  />
                </button>
              </li>
            );
          }

          return (
            <li key={swatch.id}>
              <span
                className={`${styles.swatch} ${isSelected ? styles.swatchSelected : ""}`}
                style={{ "--swatch-color": swatch.color } as CSSProperties}
                aria-label={swatch.label}
                aria-current={isSelected ? "true" : undefined}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
