// Shared TypeScript types for vision-aware layout returned by FastAPI

export type Platform = "instagram" | "facebook" | "stories" | "tiktok" | "x" | "web";

export type ElementStyle = {
  font_family: string;
  font_size_px: number;
  font_weight: string;
  letter_spacing: number;
  line_height: number; // unitless multiplier
  text_align: "left" | "center" | "right";
  fill: string; // text color
  stroke: string; // text stroke color
  stroke_width: number; // in px at design scale
  shadow: string; // CSS-compatible text-shadow string
  background_fill: string; // background color (optional)
  background_blur: number; // blur amount in px at design scale
};

export type ElementBox = {
  text: string;
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0..1
  anchor: "tl"|"tc"|"tr"|"cl"|"cc"|"cr"|"bl"|"bc"|"br";
  rotation_deg: number;
  style: ElementStyle;
};

export type Candidate = {
  id: string;
  score: number;
  design_notes: string;
  elements: {
    heading: ElementBox;
    subheading: ElementBox;
    cta: ElementBox;
  };
};

export type DisoritiLayout = {
  meta: {
    platform: Platform;
    aspect_ratio: string; // e.g., "1:1"
    safe_area: [number, number, number, number]; // [x,y,w,h] normalized
  };
  candidates: Candidate[];
};

export type SceneDigest = {
  image_size: [number, number]; // [W,H] in pixels (natural image size)
  faces: [number,number,number,number][];
  salient_regions: [number,number,number,number][];
  negative_space: [number,number,number,number][];
  dominant_colors: string[];
  logo_regions: [number,number,number,number][];
};

export type ApiResponse<T = DisoritiLayout> = {
  ok: boolean;
  scene_digest: SceneDigest;
  result: T;
};

export type ImageRenderedSize = { w: number; h: number };



