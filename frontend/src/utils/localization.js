import en from "../localization/text_en.json";
import ru from "../localization/text_ru.json";
import es from "../localization/text_es.json";
import hu from "../localization/text_hu.json";

const translations = { en, ru, es, hu };

export function detectLanguage() {
  const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (tgLang) return tgLang.split("-")[0].toLowerCase();

  const browserLang = navigator.language.split("-")[0].toLowerCase();
  return browserLang;
}

export function loadContent(langCode = "en") {
  const supported = ["en", "ru", "es", "hu"];
  const lang = supported.includes(langCode) ? langCode : "en";
  return translations[lang] || translations.en;
}