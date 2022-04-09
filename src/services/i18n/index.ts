import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import HttpApi from "i18next-http-backend";
import supportedLanguages from "./supportedLanguages";

i18next
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    supportedLngs: Array.from(supportedLanguages.keys()),
    lng: window.localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    ns: ["common", "HomeScreen", "SettingsScreen"],
    defaultNS: "common",
    keySeparator: ".",
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === "development",
    joinArrays: " "
  });
