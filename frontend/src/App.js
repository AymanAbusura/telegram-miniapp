// import { useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import WelcomeCard from "./components/WelcomeCard";
// import Home from "./components/Home";
// import Benefit from "./components/Benefit";
// import Ranking from "./components/Ranking";
// import Profile from "./components/Profile";
// import './App.css';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<WelcomeCard />} />
//         <Route path="/Home" element={<Home />} />
//         <Route path="/Benefit" element={<Benefit />} />
//         <Route path="/Ranking" element={<Ranking />} />
//         <Route path="/Profile" element={<Profile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeCard from "./components/WelcomeCard";
import Home from "./components/Home";
import Benefit from "./components/Benefit";
import Ranking from "./components/Ranking";
import Profile from "./components/Profile";
import './App.css';

function App() {
  const [subid, setSubid] = useState(null);

  useEffect(() => {
    let id = null;

    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
      id = window.Telegram.WebApp.initDataUnsafe.start_param;
    }

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