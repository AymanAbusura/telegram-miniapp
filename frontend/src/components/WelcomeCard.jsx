import { motion } from "framer-motion";
import coinImg from "../assets/coin.webp";
import Home from "./Home";

export default function WelcomeCard({ content, homeContent, subid }) {
  const [showHome, setShowHome] = useState(false);

  if (showHome) {
    return <Home content={homeContent} subid={subid} />;
  }

  return (
    <div className="welcome-container">
      <div className="card-content">
        <motion.img
          src={coinImg}
          alt="Coin"
          className="welcome-coin"
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            scale: { type: "spring", stiffness: 100 },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
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

        <button className="start-button" onClick={() => setShowHome(true)}>
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}