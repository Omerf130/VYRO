import { BrandLogo } from "@/components/layout/BrandLogo/BrandLogo";
import { Container } from "@/components/ui/Container/Container";
import { footerNav, siteConfig } from "@/lib/constants/site";
import styles from "./Footer.module.scss";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <Container className={styles.inner}>
        <div className={styles.brandBlock}>
          <BrandLogo placement="footer" />
        </div>

        <nav className={styles.nav} aria-label="Footer">
          <ul className={styles.navList}>
            {footerNav.map((item) => (
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

        <p className={styles.copy}>
          © {year} {siteConfig.name}. Portfolio showcase.
        </p>
      </Container>
    </footer>
  );
}
