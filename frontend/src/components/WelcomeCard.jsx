import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import coinImg from "../assets/coin.webp";

import texts from "../data/texts.json";

export default function WelcomeCard() {
  const navigate = useNavigate();
  const content = texts.welcomeCard;

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
          {content.headerStart}{" "}
          <span className="highlight">{content.highlight}</span>{" "}
          {content.headerEnd}
        </h1>
        <p className="subtext">{content.subtext}</p>

        <div>
          <div className="info-list">
            {content.infoList.map((item, index) => (
              <div className="info-item" key={index}>
                <span className="icon">{item.icon}</span>
                <div>
                  <p className="info-title">{item.title}</p>
                  <p className="info-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="start-button" onClick={() => navigate("/Home")}>
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}