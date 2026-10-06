"use client";

import type { HeroLook } from "@/data/hero-looks";
import styles from "./HeroLookSelector.module.scss";

type HeroLookSelectorProps = {
  looks: HeroLook[];
  activeIndex: number;
  cycleKey: number;
  rotationMs: number;
  animateProgress: boolean;
  onSelect: (index: number) => void;
};

export function HeroLookSelector({
  looks,
  activeIndex,
  cycleKey,
  rotationMs,
  animateProgress,
  onSelect,
}: HeroLookSelectorProps) {
  return (
    <div
      className={styles.root}
      role="tablist"
      aria-label="Hero colorway selection"
    >
      {looks.map((look) => {
        const isActive = look.index === activeIndex;

        return (
          <div key={look.id} className={styles.item}>
            <button
              type="button"
              role="tab"
              id={`hero-look-tab-${look.id}`}
              aria-selected={isActive}
              aria-controls={`hero-look-panel-${look.id}`}
              className={styles.tab}
              onClick={() => onSelect(look.index)}
            >
              <span className={styles.label}>{look.label}</span>
            </button>
            <div className={styles.progressTrack} aria-hidden>
              {isActive ? (
                <span
                  key={`progress-${look.id}-${cycleKey}`}
                  className={styles.progressFill}
                  style={{
                    animationDuration: animateProgress
                      ? `${rotationMs}ms`
                      : "0ms",
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
