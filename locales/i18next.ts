import { initReactI18next } from "react-i18next";
import i18next from "i18next";

import de from "./de.json";

const resources = { de: { translation: de } };

if (!i18next.language) {
  i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    fallbackLng: "de",
    debug: true,
    resources,
    lng: "de",
  });
}

export default i18next;
