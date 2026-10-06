"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { primaryNav, siteConfig } from "@/lib/constants/site";
import styles from "./Header.module.scss";

function subscribeToClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function HeaderMobileNav() {
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const menuOverlay =
    isClient && open
      ? createPortal(
          <div className={styles.menuOverlay} role="presentation">
            <div
              className={styles.menuBackdrop}
              aria-hidden
              onClick={closeMenu}
            />

            <div
              id={menuId}
              className={styles.menuPanel}
              aria-hidden={false}
            >
              <nav className={styles.menuNav} aria-label="Mobile primary">
                <ul className={styles.menuList}>
                  {primaryNav.map((item, index) => {
                    const indexLabel = String(index + 1).padStart(2, "0");

                    return (
                      <li key={item.label} className={styles.menuItem}>
                        {item.disabled ? (
                          <span
                            className={styles.menuLinkDisabled}
                            aria-disabled="true"
                          >
                            <span className={styles.menuIndex}>
                              {indexLabel}
                            </span>
                            <span className={styles.menuLabel}>
                              {item.label}
                            </span>
                          </span>
                        ) : (
                          <a
                            className={styles.menuLink}
                            href={item.href}
                            onClick={closeMenu}
                          >
                            <span className={styles.menuIndex}>
                              {indexLabel}
                            </span>
                            <span className={styles.menuLabel}>
                              {item.label}
                            </span>
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <p className={styles.menuTagline} aria-hidden>
                {siteConfig.tagline}
              </p>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={styles.mobileNavRoot}>
      <button
        ref={toggleRef}
        type="button"
        className={`${styles.menuToggle} ${open ? styles.menuToggleOpen : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={toggleMenu}
      >
        <span className={styles.menuToggleLines} aria-hidden>
          <span className={styles.menuToggleLine} />
          <span className={styles.menuToggleLine} />
          <span className={styles.menuToggleLine} />
        </span>
      </button>

      {menuOverlay}
    </div>
  );
}
