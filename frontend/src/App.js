import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeCard from "./components/WelcomeCard";
import Home from "./components/Home";
import Benefit from "./components/Benefit";
import Ranking from "./components/Ranking";
import Profile from "./components/Profile";
import WebVersion from "./components/WebVersion";
import { detectLanguage, loadContent } from "./utils/localization";
import './App.css';

function App() {
  const [subid, setSubid] = useState(null);
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const inTelegram =
      tg && typeof tg.initDataUnsafe === "object" && Object.keys(tg.initDataUnsafe).length > 0;
    setIsTelegramApp(inTelegram);

    const lang = detectLanguage();
    const localization = loadContent(lang);
    console.log("🌍 Detected language:", lang);
    setContent(localization);

    let id = tg?.initDataUnsafe?.start_param || null;
    if (!id) {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get("ref");
    }

    if (id) {
      setSubid(id);
      localStorage.setItem("startParam", id);
      console.log("SubID found:", id);
    } else {
      console.log("SubID not found");
    }
  }, []);
  

  if (!content) return null;

  if (!isTelegramApp) {
    return <WebVersion content={content.desktop} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeCard content={content.welcomeCard} subid={subid} />} />
        <Route path="/home" element={<Home subid={subid} content={content.home} />} />
        <Route path="/benefit" element={<Benefit content={content.benefit} />} />
        <Route path="/ranking" element={<Ranking content={content.ranking} />} />
        <Route path="/profile" element={<Profile content={content.profile} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;