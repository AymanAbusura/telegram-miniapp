import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coinImg from "../assets/coin.webp";
import { ChevronRight, ArrowUp } from "lucide-react";
import MenuBar from "./MenuBar";
import useBalance from "../hooks/useBalance";
import AnimatedModal from "../components/AnimatedModal";
import WithdrawForm from "../components/WithdrawForm";
import UpdateCard from "../components/UpdateCard";

import texts from "../data/texts.json";

export default function Home({ subid }) {
  const content = texts.home;

  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem("subscribed") === "true";
  });

  const [currentTab, setCurrentTab] = useState("Home");
  const [balance, setBalance] = useBalance();

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem("energy");
    return saved ? parseInt(saved, 10) : 30;
  });

  const [maxEnergy, setMaxEnergy] = useState(() =>
    localStorage.getItem("subscribed") === "true" ? 60 : 30
  );

  const [floatingTexts, setFloatingTexts] = useState([]);

  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showUpdatesCard, setShowUpdatesCard] = useState(false);

  useEffect(() => {
    localStorage.setItem("balance", balance.toFixed(2));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("energy", energy.toString());
  }, [energy]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => (prev < maxEnergy ? prev + 1 : prev));
    }, 30000);
    return () => clearInterval(interval);
  }, [maxEnergy]);

  useEffect(() => {
    localStorage.setItem("subscribed", subscribed ? "true" : "false");

    if (subscribed) {
      setMaxEnergy(60);
      setEnergy((prev) => Math.max(prev, 60));
    } else {
      setMaxEnergy(30);
      setEnergy((prev) => Math.min(prev, 30));
    }
  }, [subscribed]);

  const handleCoinClick = () => {
    if (energy > 0) {
      setBalance((prev) => prev + 0.05);
      setEnergy((prev) => prev - 1);

      const id = Math.random().toString(36).substr(2, 9);
      setFloatingTexts((prev) => [
        ...prev,
        { id, text: content.floatingText },
      ]);

      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
      }, 1000);
    }
  };

  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount)) {
      setErrorMessage(content.withdraw.invalidNumberError);
      return;
    }

    if (amount < 200000) {
      setErrorMessage(content.withdraw.minAmountError);
      return;
    }

    if (amount > balance) {
      setErrorMessage(content.withdraw.notEnoughMoneyError);
      return;
    }

    setBalance((prev) => prev - amount);
    setShowWithdrawForm(false);
    setErrorMessage("");
    alert(content.withdraw.successMessage.replace("{{amount}}", amount));
  };

  useEffect(() => {
    if (energy <= 10) {
      setShowUpdatesCard(true);
    }
  }, [energy]);

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="withdraw-box">
          <button
            className="withdraw-button"
            onClick={() => setShowWithdrawForm(true)}
          >
            <span className="withdraw-icon">
              <ArrowUp size={18} style={{ color: "white" }} />
            </span>
            {content.withdraw.button}
          </button>
        </div>
      </div>

      {/* Withdraw Form */}
      <AnimatedModal
        isOpen={showWithdrawForm}
        onClose={() => setShowWithdrawForm(false)}
        from="top"
        wrapperClass="withdraw-form-container"
      >
        <WithdrawForm
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          handleWithdrawSubmit={handleWithdrawSubmit}
          errorMessage={errorMessage}
        />
      </AnimatedModal>

      {/* Update Card */}
      <AnimatedModal
        isOpen={showUpdatesCard}
        onClose={() => setShowUpdatesCard(false)}
        from="bottom"
        wrapperClass="updates-card-container"
      >
        <UpdateCard setSubscribed={setSubscribed} />
      </AnimatedModal>

      <div className="balance-section" style={{ position: "relative" }}>
        <h1 className="balance">
          {balance.toFixed(2)}{" "}
          <span className="home-currency">{content.balance.currency}</span>
        </h1>

        <AnimatePresence>
          {floatingTexts.map((ft) => (
            <motion.div
              key={ft.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute",
                bottom: "150px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                fontSize: "42px",
                fontWeight: "900",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              {ft.text}
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.img
          src={coinImg}
          alt="Coin"
          className="home-coin"
          onClick={handleCoinClick}
          whileTap={{ scale: 1.2 }}
        />
      </div>

      <div>
        <div className="energy-section">
          <div className="energy-info">
            ⚡ {energy}/{maxEnergy}
          </div>
          <button
            className="updates-btn"
            onClick={() => setShowUpdatesCard(true)}
          >
            {content.updates.button}
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="energy-bar">
          <div
            className="energy-fill"
            style={{ width: `${(energy / maxEnergy) * 100}%` }}
          ></div>
        </div>
      </div>

      <MenuBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}