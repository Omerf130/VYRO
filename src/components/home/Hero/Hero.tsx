"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import {
  HERO_ROTATION_MS,
  heroBubbleAsset,
  heroLooks,
} from "@/data/hero-looks";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { HeroLookSelector } from "./HeroLookSelector";
import { HeroProductCard } from "./HeroProductCard";
import styles from "./Hero.module.scss";

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const activeLook = heroLooks[activeIndex] ?? heroLooks[0];

  const selectLook = useCallback((index: number) => {
    setActiveIndex(index);
    setCycleKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroLooks.length);
      setCycleKey((key) => key + 1);
    }, HERO_ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion, cycleKey]);

  return (
    <section
      className={styles.hero}
      data-look={activeLook.id}
      aria-label="VYRO campaign hero"
    >
      <div className={styles.heroVignette} aria-hidden />

      <div className={styles.heroBubbleCanvas} aria-hidden>
        <div className={styles.bubbleDrift}>
          <Image
            src={heroBubbleAsset.src}
            alt=""
            width={heroBubbleAsset.width}
            height={heroBubbleAsset.height}
            className={styles.bubbleImage}
            priority
            sizes="(max-width: 768px) 100vw, 1px"
          />
        </div>
      </div>

      <Container variant="wide" className={styles.inner}>
        <div className={styles.campaign}>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>MOVE</span>
            <span className={styles.headlineLine}>DIFFERENT.</span>
          </h1>
          <p className={styles.supporting}>
            SNEAKERS FOR
            <br />
            A BOLDER
            <br />
            TOMORROW.
          </p>
        </div>

        <div className={styles.visual}>
          <div className={styles.productStage}>
            <div className={styles.ambientStage} aria-hidden>
              <div
                className={`${styles.distantGlow} ${styles.distantGlowSolar}`}
              />
              <div
                className={`${styles.distantGlow} ${styles.distantGlowAurora}`}
              />
            </div>

            <div className={styles.bubbleDrift} aria-hidden>
              <Image
                src={heroBubbleAsset.src}
                alt=""
                width={heroBubbleAsset.width}
                height={heroBubbleAsset.height}
                className={styles.bubbleImage}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 62vw, 920px"
              />
            </div>

            <div className={styles.shoeStage}>
              {heroLooks.map((look) => {
                const isActive = look.index === activeIndex;

                return (
                  <div
                    key={look.id}
                    className={`${styles.shoeFrame} ${isActive ? styles.shoeFrameActive : ""}`}
                    aria-hidden={!isActive}
                  >
                    <div
                      className={`${styles.shoeTransition} ${isActive ? styles.shoeTransitionActive : ""}`}
                    >
                      <div className={styles.shoeFloat}>
                        <Image
                          src={look.imageSrc}
                          alt={isActive ? look.imageAlt : ""}
                          width={look.imageWidth}
                          height={look.imageHeight}
                          className={styles.shoeImage}
                          priority={look.index === 0}
                          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 58vw, 780px"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.cardArea}>
              {heroLooks.map((look) => {
                const isActive = look.index === activeIndex;

                return (
                  <div
                    key={look.id}
                    className={`${styles.cardFrame} ${isActive ? styles.cardFrameActive : ""}`}
                    aria-hidden={!isActive}
                  >
                    <HeroProductCard
                      look={look}
                      panelId={`hero-look-panel-${look.id}`}
                      labelledBy={`hero-look-tab-${look.id}`}
                      compactLayout
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.ctas}>
          <Button
            href="#"
            variant="primary"
            size="md"
            className={styles.cta}
            disabled
          >
            Shop Collection
          </Button>
          <Button
            href="#"
            variant="secondary"
            size="md"
            className={styles.cta}
            disabled
          >
            Explore VYRO Lab
          </Button>
        </div>

        <div className={styles.selector}>
          <HeroLookSelector
            looks={heroLooks}
            activeIndex={activeIndex}
            cycleKey={cycleKey}
            rotationMs={HERO_ROTATION_MS}
            animateProgress={!prefersReducedMotion}
            onSelect={selectLook}
          />
        </div>
      </Container>
    </section>
  );
}
