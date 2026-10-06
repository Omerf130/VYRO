"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/constants/site";
import styles from "./BrandLogo.module.scss";

type BrandLogoPlacement = "header" | "footer";

type BrandLogoProps = {
  placement?: BrandLogoPlacement;
  priority?: boolean;
};

export function BrandLogo({
  placement = "header",
  priority,
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);
  const { brandLogo, name } = siteConfig;

  return (
    <Link href="/" className={styles.link} aria-label={`${name} home`}>
      {!imageError ? (
        <Image
          src={brandLogo.src}
          alt={brandLogo.alt}
          width={brandLogo.width}
          height={brandLogo.height}
          className={`${styles.image} ${styles[placement]}`}
          priority={priority ?? placement === "header"}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={styles.wordmark}>{name}</span>
      )}
    </Link>
  );
}
