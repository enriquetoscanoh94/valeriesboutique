import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { translations } from "../i18n/translations"

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("valeries-language") || "es")

  useEffect(() => {
    localStorage.setItem("valeries-language", language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "es" ? "en" : "es"),
    t: translations[language],
    localize: (value) => value?.[language] ?? value?.es ?? "",
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useLanguage = () => useContext(LanguageContext)
