export const siteConfig = {
  name: "VYRO",
  tagline: "MOVE DIFFERENT.",
  description:
    "VYRO — premium future-streetwear sneakers. Built as a portfolio showcase.",
  brandLogo: {
    src: "/brand/logo.png",
    width: 2172,
    height: 724,
    alt: "VYRO — MOVE DIFFERENT.",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

export const primaryNav: NavItem[] = [
  { label: "Shop", href: "#", disabled: true },
  { label: "NEXUS", href: "#", disabled: true },
  { label: "Lab", href: "#", disabled: true },
];

export const footerNav: NavItem[] = [
  { label: "About", href: "#", disabled: true },
  { label: "Help", href: "#", disabled: true },
  { label: "Contact", href: "#", disabled: true },
];
