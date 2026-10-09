export type VyroLabRegionId =
  | "upper"
  | "accent"
  | "sole"
  | "purplePanels"
  | "midsole";

export type VyroLabSwatch = {
  id: string;
  label: string;
  color: string;
};

export type VyroLabRegionConfig = {
  id: VyroLabRegionId;
  label: string;
  swatches: VyroLabSwatch[];
  defaultSwatchId: string;
};

export type VyroLabRecolorGroupId =
  | "baseColor"
  | "midsoleFoam"
  | "blueDetails"
  | "orangeAccents"
  | "purplePanels";

export type VyroLabRecolorGroupConfig = {
  id: VyroLabRecolorGroupId;
  controlRegionId: Extract<
    VyroLabRegionId,
    "upper" | "midsole" | "sole" | "accent" | "purplePanels"
  >;
  factorySwatchId: string;
  masks: Array<{
    id: string;
    src: string;
  }>;
  lettering?: "nexusSoleInsert";
};

export type VyroLabPreviewConfig = {
  productId: "nexus";
  sneakerImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  recolorGroups: VyroLabRecolorGroupConfig[];
  regions: VyroLabRegionConfig[];
};

export const vyroLabOriginalUpperSwatchId = "upper-original";
export const vyroLabOriginalSoleSwatchId = "sole-original";
export const vyroLabOriginalAccentSwatchId = "accent-original";
export const vyroLabOriginalPurpleSwatchId = "purple-original";
export const vyroLabOriginalMidsoleSwatchId = "midsole-original";

export const vyroLabRecolorGroupOrder: VyroLabRecolorGroupId[] = [
  "baseColor",
  "midsoleFoam",
  "blueDetails",
  "orangeAccents",
  "purplePanels",
];

const nexusImageSize = { width: 1536, height: 1024 } as const;

export const vyroLabPreviewConfig: VyroLabPreviewConfig = {
  productId: "nexus",
  sneakerImage: {
    src: "/brand/Featured Collection/nexus.png",
    alt: "VYRO NEXUS sneaker preview for VYRO LAB customization",
    ...nexusImageSize,
  },
  recolorGroups: [
    {
      id: "baseColor",
      controlRegionId: "upper",
      factorySwatchId: vyroLabOriginalUpperSwatchId,
      masks: [
        {
          id: "baseUpper",
          src: "/brand/Featured Collection/masks/nexus_base_upper_mask.png",
        },
      ],
    },
    {
      id: "midsoleFoam",
      controlRegionId: "midsole",
      factorySwatchId: vyroLabOriginalMidsoleSwatchId,
      masks: [
        {
          id: "midsole",
          src: "/brand/Featured Collection/masks/nexus_midsole_mask.png",
        },
      ],
    },
    {
      id: "blueDetails",
      controlRegionId: "sole",
      factorySwatchId: vyroLabOriginalSoleSwatchId,
      lettering: "nexusSoleInsert",
      masks: [
        {
          id: "soleInsert",
          src: "/brand/Featured Collection/masks/nexus_sole_insert_mask.png",
        },
        {
          id: "logo",
          src: "/brand/Featured Collection/masks/nexus_logo_mask.png",
        },
        {
          id: "outsole",
          src: "/brand/Featured Collection/masks/nexus_outsole_mask.png",
        },
      ],
    },
    {
      id: "orangeAccents",
      controlRegionId: "accent",
      factorySwatchId: vyroLabOriginalAccentSwatchId,
      masks: [
        {
          id: "orangeUpper",
          src: "/brand/Featured Collection/masks/nexus_orange_upper_mask.png",
        },
        {
          id: "orangeOutsole",
          src: "/brand/Featured Collection/masks/nexus_orange_outsole_mask.png",
        },
      ],
    },
    {
      id: "purplePanels",
      controlRegionId: "purplePanels",
      factorySwatchId: vyroLabOriginalPurpleSwatchId,
      masks: [
        {
          id: "purpleUpper",
          src: "/brand/Featured Collection/masks/nexus_purple_upper_mask.png",
        },
        {
          id: "purpleOutsole",
          src: "/brand/Featured Collection/masks/nexus_purple_outsole_mask.png",
        },
      ],
    },
  ],
  regions: [
    {
      id: "upper",
      label: "COLOR",
      defaultSwatchId: vyroLabOriginalUpperSwatchId,
      swatches: [
        {
          id: vyroLabOriginalUpperSwatchId,
          label: "Factory white upper",
          color: "#f4f4f6",
        },
        {
          id: "upper-light-gray",
          label: "Light gray upper",
          color: "#c8ccd4",
        },
        {
          id: "upper-charcoal",
          label: "Charcoal upper",
          color: "#3a3d48",
        },
        {
          id: "upper-electric-blue",
          label: "Electric blue upper",
          color: "#008cff",
        },
        {
          id: "upper-deep-red",
          label: "Deep red upper",
          color: "#ff174f",
        },
        {
          id: "upper-sand",
          label: "Sand upper",
          color: "#d4c4a8",
        },
      ],
    },
    {
      id: "accent",
      label: "ACCENT",
      defaultSwatchId: vyroLabOriginalAccentSwatchId,
      swatches: [
        {
          id: vyroLabOriginalAccentSwatchId,
          label: "Factory orange accents",
          color: "#ff651d",
        },
        { id: "accent-purple", label: "Purple accent", color: "#873bff" },
        { id: "accent-pink", label: "Pink accent", color: "#ff4d9d" },
        { id: "accent-green", label: "Green accent", color: "#3dffa8" },
        { id: "accent-lime", label: "Lime accent", color: "#b8ff3c" },
      ],
    },
    {
      id: "sole",
      label: "SOLE",
      defaultSwatchId: vyroLabOriginalSoleSwatchId,
      swatches: [
        {
          id: vyroLabOriginalSoleSwatchId,
          label: "Factory blue details",
          color: "#008cff",
        },
        { id: "sole-white", label: "White sole insert", color: "#eceef2" },
        { id: "sole-charcoal", label: "Charcoal sole insert", color: "#3a3d48" },
        { id: "sole-orange", label: "Orange sole insert", color: "#ff7a45" },
        { id: "sole-purple", label: "Purple sole insert", color: "#873bff" },
        { id: "sole-cyan", label: "Cyan sole insert", color: "#40c8ff" },
      ],
    },
    {
      id: "purplePanels",
      label: "PURPLE PANELS",
      defaultSwatchId: vyroLabOriginalPurpleSwatchId,
      swatches: [
        {
          id: vyroLabOriginalPurpleSwatchId,
          label: "Factory purple panels",
          color: "#873bff",
        },
        {
          id: "purple-electric-blue",
          label: "Electric blue panels",
          color: "#008cff",
        },
        {
          id: "purple-neon-pink",
          label: "Neon pink panels",
          color: "#ff4d9d",
        },
        {
          id: "purple-lime",
          label: "Lime green panels",
          color: "#b8ff3c",
        },
        {
          id: "purple-deep-red",
          label: "Deep red panels",
          color: "#ff174f",
        },
        {
          id: "purple-bright-cyan",
          label: "Bright cyan panels",
          color: "#40c8ff",
        },
      ],
    },
    {
      id: "midsole",
      label: "MIDSOLE",
      defaultSwatchId: vyroLabOriginalMidsoleSwatchId,
      swatches: [
        {
          id: vyroLabOriginalMidsoleSwatchId,
          label: "Factory white midsole",
          color: "#f4f4f6",
        },
        {
          id: "midsole-light-gray",
          label: "Light gray midsole",
          color: "#c8ccd4",
        },
        {
          id: "midsole-charcoal",
          label: "Charcoal midsole",
          color: "#3a3d48",
        },
        {
          id: "midsole-electric-blue",
          label: "Electric blue midsole",
          color: "#008cff",
        },
        {
          id: "midsole-deep-purple",
          label: "Deep purple midsole",
          color: "#873bff",
        },
        {
          id: "midsole-warm-sand",
          label: "Warm sand midsole",
          color: "#d4c4a8",
        },
      ],
    },
  ],
};

export function getVyroLabRecolorGroup(
  config: VyroLabPreviewConfig,
  groupId: VyroLabRecolorGroupId,
): VyroLabRecolorGroupConfig {
  const group = config.recolorGroups.find((entry) => entry.id === groupId);

  if (!group) {
    throw new Error(`Missing VYRO LAB recolor group: ${groupId}`);
  }

  return group;
}

export function getVyroLabRegionForGroup(
  config: VyroLabPreviewConfig,
  group: VyroLabRecolorGroupConfig,
): VyroLabRegionConfig {
  const region = config.regions.find(
    (entry) => entry.id === group.controlRegionId,
  );

  if (!region) {
    throw new Error(
      `Missing VYRO LAB region for group: ${group.controlRegionId}`,
    );
  }

  return region;
}
