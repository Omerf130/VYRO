export type HeroLookId = "solar" | "aurora";

export type HeroLook = {
  id: HeroLookId;
  index: number;
  label: string;
  productLine1: string;
  productLine2: string;
  productCopy: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

export const HERO_ROTATION_MS = 5000;

export const heroBubbleAsset = {
  src: "/brand/hero/3D-bubble.png",
  width: 1536,
  height: 1024,
} as const;

export const heroLooks: HeroLook[] = [
  {
    id: "solar",
    index: 0,
    label: "01",
    productLine1: "NEXUS",
    productLine2: "SOLAR",
    productCopy: "Future runner built for heat, speed, and solar intensity.",
    imageSrc: "/brand/hero/hero-shoe1.png",
    imageAlt:
      "VYRO NEXUS SOLAR sneaker in warm orange and purple accents, three-quarter view",
    imageWidth: 1536,
    imageHeight: 1024,
  },
  {
    id: "aurora",
    index: 1,
    label: "02",
    productLine1: "NEXUS",
    productLine2: "AURORA",
    productCopy: "Future runner tuned for cool light and after-dark momentum.",
    imageSrc: "/brand/hero/hero-shoe2.png",
    imageAlt:
      "VYRO NEXUS AURORA sneaker in cyan, blue, and purple accents, three-quarter view",
    imageWidth: 1536,
    imageHeight: 1024,
  },
];
