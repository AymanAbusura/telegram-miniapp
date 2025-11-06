import { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeCard from "./components/WelcomeCard";
import Home from "./components/Home";
import Benefit from "./components/Benefit";
import Ranking from "./components/Ranking";
import Profile from "./components/Profile";
import WebVersion from "./components/WebVersion";
import { detectLanguage, loadContent } from "./utils/appLocalization.js";
import useSubid from "./hooks/useSubid";
import './App.css';

function App() {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [content, setContent] = useState(null);

  const subid = useSubid();
  const sentRef = useRef(false);

  useEffect(() => {
    // шлём постбек только если:
    // 1) у нас есть subid
    // 2) мы ещё не отправляли
    if (!subid || sentRef.current) return;

    sentRef.current = true;

    // !!! ЗДЕСЬ ТВОЯ ССЫЛКА KEITARO !!!
    // пример:
    // const url = `https://your-keitaro-domain.com/postback?key=SECRET&subid=${encodeURIComponent(subid)}&status=open`;
    const url = `https://rooroquaphou.beget.app?payout=0&status=lead&from=TG&subid=${encodeURIComponent(
      subid
    )}&status=open`;

    // отправим "в фоне", нам не важен ответ
    fetch(url, {
      method: "GET",
      mode: "no-cors",
    }).catch((e) => {
      // ничего страшного, просто залогируем в консоль
      console.warn("Keitaro postback failed", e);
    });

    // узнаем язык
    const lang = detectLanguage();
    const localization = loadContent(lang);
    console.log("🌍 Detected language:", lang);
    setContent(localization);

  }, [subid]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    const inTelegram = tg && typeof tg.initDataUnsafe === "object" && Object.keys(tg.initDataUnsafe).length > 0;
    setIsTelegramApp(inTelegram);
  }, []);
  
  useEffect(() => {
    const lang = detectLanguage();
    const localization = loadContent(lang);
    console.log("🌍 Detected language:", lang);
    setContent(localization);
  }, []);

  if (!content) return <div>Loading...</div>;

  if (!isTelegramApp) {
    return <WebVersion content={content.desktop} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeCard content={content.welcomeCard} />} />
        <Route path="/home" element={<Home content={content.home} />} />
        <Route path="/benefit" element={<Benefit content={content.benefit} />} />
        <Route path="/ranking" element={<Ranking content={content.ranking} />} />
        <Route path="/profile" element={<Profile content={content.profile} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;