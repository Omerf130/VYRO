export type FeaturedAccent = "nexus" | "eclipse" | "pulse";

export type FeaturedProduct = {
  id: FeaturedAccent;
  index: string;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  backImageSrc: string;
  backImageWidth: number;
  backImageHeight: number;
};

export const featuredCollectionEyebrow = "FEATURED COLLECTION";

export const featuredCollectionDescription =
  "Three silhouettes. One design language. Built for movement, expression and everything after dark.";

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "nexus",
    index: "01",
    name: "NEXUS",
    description: "The flagship.\nDesigned for what's next.",
    imageSrc: "/brand/Featured Collection/nexus.png",
    imageAlt:
      "VYRO NEXUS sneaker in electric blue, cyan, and purple accents, three-quarter view",
    imageWidth: 1536,
    imageHeight: 1024,
    backImageSrc: "/brand/Featured Collection/nexus-back.png",
    backImageWidth: 1536,
    backImageHeight: 1024,
  },
  {
    id: "eclipse",
    index: "02",
    name: "ECLIPSE",
    description: "Darker, sharper.\nMore aggressive.",
    imageSrc: "/brand/Featured Collection/eclipse.png",
    imageAlt:
      "VYRO ECLIPSE sneaker in deep purple and violet tones, three-quarter view",
    imageWidth: 1536,
    imageHeight: 1024,
    backImageSrc: "/brand/Featured Collection/eclipse-back.png",
    backImageWidth: 1536,
    backImageHeight: 1024,
  },
  {
    id: "pulse",
    index: "03",
    name: "PULSE",
    description: "Lighter. Energetic.\nPerformance-inspired.",
    imageSrc: "/brand/Featured Collection/pulse.png",
    imageAlt:
      "VYRO PULSE sneaker in orange and warm red accents, three-quarter view",
    imageWidth: 1536,
    imageHeight: 1024,
    backImageSrc: "/brand/Featured Collection/pulse-back.png",
    backImageWidth: 1536,
    backImageHeight: 1024,
  },
];
