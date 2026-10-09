"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container/Container";
import { vyroLabPreviewConfig } from "@/data/vyro-lab";
import { ColorSwatches } from "./ColorSwatches";
import { ShoePreview } from "./ShoePreview";
import styles from "./VyroLabSection.module.scss";

function findRegion(id: (typeof vyroLabPreviewConfig.regions)[number]["id"]) {
  return (
    vyroLabPreviewConfig.regions.find((region) => region.id === id) ??
    vyroLabPreviewConfig.regions[0]
  );
}

export function VyroLabSection() {
  const upperRegion = useMemo(() => findRegion("upper"), []);
  const soleRegion = useMemo(() => findRegion("sole"), []);
  const accentRegion = useMemo(() => findRegion("accent"), []);
  const purpleRegion = useMemo(() => findRegion("purplePanels"), []);
  const midsoleRegion = useMemo(() => findRegion("midsole"), []);

  const [selectedUpperSwatchId, setSelectedUpperSwatchId] = useState(
    upperRegion.defaultSwatchId,
  );
  const [selectedMidsoleSwatchId, setSelectedMidsoleSwatchId] = useState(
    midsoleRegion.defaultSwatchId,
  );
  const [selectedSoleSwatchId, setSelectedSoleSwatchId] = useState(
    soleRegion.defaultSwatchId,
  );
  const [selectedAccentSwatchId, setSelectedAccentSwatchId] = useState(
    accentRegion.defaultSwatchId,
  );
  const [selectedPurpleSwatchId, setSelectedPurpleSwatchId] = useState(
    purpleRegion.defaultSwatchId,
  );

  return (
    <section className={styles.section} aria-labelledby="vyro-lab-heading">
      <Container variant="wide" className={styles.inner}>
        <div className={styles.layout}>
          <ShoePreview
            config={vyroLabPreviewConfig}
            selectedUpperSwatchId={selectedUpperSwatchId}
            selectedMidsoleSwatchId={selectedMidsoleSwatchId}
            selectedSoleSwatchId={selectedSoleSwatchId}
            selectedAccentSwatchId={selectedAccentSwatchId}
            selectedPurpleSwatchId={selectedPurpleSwatchId}
          />

          <div className={styles.panel}>
            <header className={styles.intro}>
              <p className={styles.eyebrow}>VYRO LAB</p>
              <h2 className={styles.title} id="vyro-lab-heading">
                MAKE IT
                <br />
                YOURS.
              </h2>
              <p className={styles.description}>
                Customize your look. Different colors. Different accents. Same
                attitude.
              </p>
            </header>

            <p className={styles.comingSoon}>
              Full NEXUS preview is live for all five color groups. Enter VYRO
              LAB coming soon.
            </p>

            <div className={styles.controls}>
              {vyroLabPreviewConfig.regions.map((region) => (
                <ColorSwatches
                  key={region.id}
                  region={region}
                  interactive
                  selectedSwatchId={
                    region.id === "upper"
                      ? selectedUpperSwatchId
                      : region.id === "midsole"
                        ? selectedMidsoleSwatchId
                        : region.id === "sole"
                          ? selectedSoleSwatchId
                          : region.id === "accent"
                            ? selectedAccentSwatchId
                            : region.id === "purplePanels"
                              ? selectedPurpleSwatchId
                              : undefined
                  }
                  onSelect={
                    region.id === "upper"
                      ? (swatchId) => setSelectedUpperSwatchId(swatchId)
                      : region.id === "midsole"
                        ? (swatchId) => setSelectedMidsoleSwatchId(swatchId)
                        : region.id === "sole"
                          ? (swatchId) => setSelectedSoleSwatchId(swatchId)
                          : region.id === "accent"
                            ? (swatchId) => setSelectedAccentSwatchId(swatchId)
                            : region.id === "purplePanels"
                              ? (swatchId) => setSelectedPurpleSwatchId(swatchId)
                              : undefined
                  }
                />
              ))}
            </div>

            <button
              type="button"
              className={styles.enterLab}
              disabled
              aria-disabled="true"
              aria-label="Enter VYRO Lab (coming soon)"
            >
              ENTER VYRO LAB →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
