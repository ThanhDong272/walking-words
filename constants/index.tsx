export const ALPHA_VALUE = {
  /** alpha value 100% */
  alpha_10: "FF",
  /** alpha value 90% */
  alpha_09: "E6",
  /** alpha value 80% */
  alpha_08: "CD",
  /** alpha value 70% */
  alpha_07: "B4",
  /** alpha value 60% */
  alpha_06: "9B",
  /** alpha value 50% */
  alpha_05: "82",
  /** alpha value 40% */
  alpha_04: "69",
  /** alpha value 30% */
  alpha_03: "37",
  /** alpha value 20% */
  alpha_02: "1E",
  /** alpha value 10% */
  alpha_01: "05",
  /** alpha value 0.5% */
  alpha_005: "0d",
  /** alpha value 0% */
  alpha_00: "00",
} as const;

export enum ORIENTATION {
  PORTRAIT = "portrait",
  LANDSCAPE_LEFT = "landscape-left",
  LANDSCAPE_RIGHT = "landscape-right",
  UNKNOWN = "unknown",
}

export enum BOOK_READER_THEME {
  LIGHT = "light",
  DARK = "dark",
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DEEP_LINK_URL = [
  /^https:\/\/walkingwords\.nxtyou\.dev\/api\/password\/reset\?token=([a-f0-9]{64})&email=(.*)$/,
];

export enum SECTION_LIST_BOOK {
  POPULAR = "popular",
  RECOMMENDED = "recommended",
  NOVEL = "novel",
}

export enum PER_PAGE {
  _10 = 10,
  _20 = 20,
}
