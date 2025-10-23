import { useState, useEffect } from "react";
import useBalance from "../hooks/useBalance";
import coinImg from "../assets/coin.png";
import { ChevronRight } from "lucide-react";
import MenuBar from "./MenuBar";

import AnimatedModal from "../components/AnimatedModal";
import UpdateCard from "../components/UpdateCard";
import UpgradeLevel from "../components/UpgradeLevel";

export default function Benefit() {
  const [currentTab, setCurrentTab] = useState("Benefit");
  const [balance] = useBalance();

  const [showUpdatesCard, setShowUpdatesCard] = useState(false);
  const [showUpgradeLevel, setShowUpgradeLevel] = useState(false);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="benefit-container">
      <h2 className="benefit-title">Credit Balance</h2>

      <div className="benefit-balance">
        <div className="benefit-balance-1">
          <img src={coinImg} alt="Coin" className="benefit-coin" />
          <span className="balance-amount">{balance.toFixed(2)}</span>
        </div>
      </div>

      <div
        className="energy-upgrade"
        onClick={() => setShowUpdatesCard(true)}
      >
        <div className="energy-upgrade-box">
          <div className="energy-icon-container">
            <div className="energy-icon">⚡</div>
            <div className="notification-badge">x2</div>
          </div>
          <div className="energy-text">
            <p className="energy-title">Double your energy</p>
            <p className="energy-desc">
              Increase your max energy and earn money faster!
            </p>
          </div>
          <ChevronRight size={40} />
        </div>
      </div>

      <h3 className="benefits-title">Benefits</h3>
      <hr className="benefits-divider" />
      <div 
        className="benefit-box"
        onClick={() => setShowUpgradeLevel(true)}
      >
        <div className="benefit-box-1">
          <div className="benefit-icon">👆</div>
          <div className="benefit-info">
            <div className="benefit-title-1">
              Upgrade
              <div className="level-badge">5 LVL</div>
            </div>
            <p className="benefit-level">
              <img src={coinImg} alt="Coin" className="benefit-level-coin" />
              5 / Level
            </p>
          </div>
        </div>
        <ChevronRight size={25} />
      </div>

      <AnimatedModal
        isOpen={showUpdatesCard}
        onClose={() => setShowUpdatesCard(false)}
        from="bottom"
        wrapperClass="updates-card-container"
      >
        <UpdateCard onClose={() => setShowUpdatesCard(false)} />
      </AnimatedModal>

      <AnimatedModal
        isOpen={showUpgradeLevel}
        onClose={() => setShowUpgradeLevel(false)}
        from="bottom"
        wrapperClass="updates-card-container"
      >
        <UpgradeLevel onClose={() => setShowUpgradeLevel(false)} />
      </AnimatedModal>

      <MenuBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}