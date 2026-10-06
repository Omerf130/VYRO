import type { ReactNode } from "react";
import styles from "./SectionHeading.module.scss";

type SectionHeadingProps = {
  overline?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  overline,
  title,
  description,
  align = "start",
  className,
}: SectionHeadingProps) {
  const classes = [styles.root, styles[align], className]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      {overline ? <p className={styles.overline}>{overline}</p> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </header>
  );
}
