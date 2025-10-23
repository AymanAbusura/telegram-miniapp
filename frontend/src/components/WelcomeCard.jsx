import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import coinImg from "../assets/coin.png";

export default function WelcomeCard() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="card-content">
        <motion.img
          src={coinImg}
          alt="Coin"
          className="welcome-coin"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        />

        <h1 className="welcome-header">
          Welcome to the <span className="highlight">Easy Money</span> Bot!
        </h1>
        <p className="subtext">
          Play, collect, and win real money — then withdraw it directly to your bank account!
        </p>

        <div className="info-list">
          <div className="info-item">
            <span className="icon">✨</span>
            <div>
              <p className="info-title">Tap the screen</p>
              <p className="info-desc">Tap the screen to collect as much money as you can.</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">🤝</span>
            <div>
              <p className="info-title">Invite your friends</p>
              <p className="info-desc">Invite your friends and win real money together!</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">💪</span>
            <div>
              <p className="info-title">Buy boosts and upgrades</p>
              <p className="info-desc">Upgrade your game and earn even more!</p>
            </div>
          </div>
        </div>

        <button className="start-button" onClick={() => navigate("/Home")}>
          Start Winning
        </button>
      </div>
    </div>
  );
}