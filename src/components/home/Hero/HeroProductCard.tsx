import { ArrowUpRight } from "lucide-react";
import type { HeroLook } from "@/data/hero-looks";
import styles from "./HeroProductCard.module.scss";

type HeroProductCardProps = {
  look: HeroLook;
  panelId: string;
  labelledBy: string;
  compactLayout?: boolean;
};

export function HeroProductCard({
  look,
  panelId,
  labelledBy,
  compactLayout = false,
}: HeroProductCardProps) {
  return (
    <article
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      className={`${styles.card} ${styles[look.id]} ${compactLayout ? styles.compactLayout : ""}`}
    >
      <div className={styles.copy}>
        <p className={styles.line1}>{look.productLine1}</p>
        <p className={styles.line2}>{look.productLine2}</p>
        <p className={styles.description}>{look.productCopy}</p>
      </div>
      <span className={styles.action} aria-hidden>
        <ArrowUpRight size={18} strokeWidth={1.75} />
      </span>
    </article>
  );
}
