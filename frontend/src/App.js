import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeCard from "./components/WelcomeCard";
import Home from "./components/Home";
import Benefit from "./components/Benefit";
import Ranking from "./components/Ranking";
import Profile from "./components/Profile";
import './App.css';

function App() {
  useEffect(() => {
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (startParam) {
      console.log("Получен параметр из deep link:", startParam);
      localStorage.setItem("startParam", startParam);
    } else {
      console.log("Нет параметра start_param");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeCard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Benefit" element={<Benefit />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;