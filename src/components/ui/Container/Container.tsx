import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.scss";

type ContainerVariant = "default" | "wide" | "narrow";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  variant?: ContainerVariant;
  className?: string;
  children: ReactNode;
};

export function Container<T extends ElementType = "div">({
  as,
  variant = "default",
  className,
  children,
}: ContainerProps<T>) {
  const Component = as ?? "div";
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes}>{children}</Component>;
}
