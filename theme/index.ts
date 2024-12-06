export const lightColors = {
  black: "#000000",
  black0F: "#0F0F0F",
  black10: "#10100E",
  black1E: "#1e1e1c",
  black005: "rgba(255, 255, 255, 0.05)",
  black14: "#141413",
  black16: "#161615",
  black1C: "#1C1C1A",
  gray7: "#121212",
  white: "#FFFFFF",
  grey7C: "#7C7C7B",
  grey1E: "#1E1E1C",
  yellowD3: "#D3B691",
  greyE2: "#E2E8F0",
  grey41: "#414141",
  yellowC9: "#C99E43",
  grey3A: "#3A3A31",
  greyD3: "#D3B6910D",
  redFF: "#ff5050",
  yellowD0: "#D09D44",
  yellowCD: "#CD9D45",
  yellow68: "#685329",
};

export const mainLinearGradient = ["#1E1E1C", "#000000"];

const METROPOLIS_BLACK = "Metropolis-Black";
const METROPOLIS_BOLD = "Metropolis-Bold";
const METROPOLIS_EXTRA_BOLD = "Metropolis-ExtraBold";
const METROPOLIS_EXTRA_LIGHT = "Metropolis-ExtraLight";
const METROPOLIS_LIGHT = "Metropolis-Light";
const METROPOLIS_MEDIUM = "Metropolis-Medium";
const METROPOLIS_REGULAR = "Metropolis-Regular";
const METROPOLIS_SEMIBOLD = "Metropolis-SemiBold";
const METROPOLIS_THIN = "Metropolis-Thin";

const INTER_BLACK = "Inter-Black";
const INTER_BOLD = "Inter-Bold";
const INTER_EXTRABOLD = "Inter-ExtraBold";
const INTER_EXTRALIGHT = "Inter-ExtraLight";
const INTER_LIGHT = "Inter-Light";
const INTER_MEDIUM = "Inter-Medium";
const INTER_REGULAR = "Inter-Regular";
const INTER_SEMIBOLD = "Inter-SemiBold";
const INTER_THIN = "Inter-Thin";

export const fonts = {
  metropolis: {
    black: METROPOLIS_BLACK,
    bold: METROPOLIS_BOLD,
    extra_bold: METROPOLIS_EXTRA_BOLD,
    extra_light: METROPOLIS_EXTRA_LIGHT,
    light: METROPOLIS_LIGHT,
    medium: METROPOLIS_MEDIUM,
    regular: METROPOLIS_REGULAR,
    semi_bold: METROPOLIS_SEMIBOLD,
    thin: METROPOLIS_THIN,
  },
  inter: {
    black: INTER_BLACK,
    bold: INTER_BOLD,
    extra_bold: INTER_EXTRABOLD,
    extra_light: INTER_EXTRALIGHT,
    light: INTER_LIGHT,
    medium: INTER_MEDIUM,
    regular: INTER_REGULAR,
    semi_bold: INTER_SEMIBOLD,
    thin: INTER_THIN,
  },
};

const DefaultTheme = {
  colors: lightColors,
  fonts,
};

export default DefaultTheme;
