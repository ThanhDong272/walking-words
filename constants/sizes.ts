const aspectRatioTypes = [
  "landscape",
  "square",
  "portrait",
  "community_event",
] as const;

export type AspectRatio = (typeof aspectRatioTypes)[number];

export const baseAspectRatio: Record<AspectRatio, number> = {
  landscape: 16 / 9,
  square: 1,
  portrait: 9 / 16,
  community_event: 5 / 2,
};
