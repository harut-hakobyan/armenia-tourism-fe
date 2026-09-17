"use client";

import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { useEffect, useState, type PropsWithChildren } from "react";
import { resources, type Locale } from "@/i18n/resources";
import { AppProviders as LegacyProviders } from "@/app/AppProviders";

export function AppProviders({ children, locale = "en" }: PropsWithChildren<{ locale?: Locale }>) {
  const [instance] = useState(() => {
    const next = createInstance();
    void next.use(initReactI18next).init({ resources, lng: locale, fallbackLng: "en", supportedLngs: Object.keys(resources), interpolation: { escapeValue: false } });
    return next;
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    localStorage.setItem("amt.locale", locale);
    if (instance.language !== locale) void instance.changeLanguage(locale);
  }, [instance, locale]);

  return <I18nextProvider i18n={instance}><LegacyProviders>{children}</LegacyProviders></I18nextProvider>;
}
