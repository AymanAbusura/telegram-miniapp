import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeCard from "./components/WelcomeCard";
import Home from "./components/Home";
import Benefit from "./components/Benefit";
import Ranking from "./components/Ranking";
import Profile from "./components/Profile";
import WebVersion from "./components/WebVersion";
import './App.css';

function App() {
  const [subid, setSubid] = useState(null);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    const inTelegram = tg && typeof tg.initDataUnsafe === "object" && Object.keys(tg.initDataUnsafe).length > 0;
    setIsTelegramApp(inTelegram);

    let id = tg?.initDataUnsafe?.start_param || null;

    if (!id) {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get("ref");
    }

    if (id) {
      setSubid(id);
      localStorage.setItem("startParam", id);
      console.log("SubID найден:", id);
    } else {
      console.log("SubID не найден");
    }
  }, []);

  if (!isTelegramApp) {
    return <WebVersion />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeCard />} />
        <Route path="/Home" element={<Home subid={subid} />} />
        <Route path="/Benefit" element={<Benefit />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;