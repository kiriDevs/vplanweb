import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import HttpApi from "i18next-http-backend";

i18next
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    supportedLngs: ["en"],
    lng: "en",
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
