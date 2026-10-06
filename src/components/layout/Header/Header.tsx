import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container/Container";
import { BrandLogo } from "@/components/layout/BrandLogo/BrandLogo";
import { primaryNav } from "@/lib/constants/site";
import { HeaderMobileNav } from "./HeaderMobileNav";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.root}>
      <Container className={styles.inner}>
        <BrandLogo placement="header" />

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.disabled ? (
                  <span className={styles.navItemDisabled} aria-disabled="true">
                    {item.label}
                  </span>
                ) : (
                  <a className={styles.navItem} href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Cart (coming soon)"
            disabled
          >
            <ShoppingBag size={20} strokeWidth={1.75} aria-hidden />
          </button>
          <HeaderMobileNav />
        </div>
      </Container>
    </header>
  );
}
