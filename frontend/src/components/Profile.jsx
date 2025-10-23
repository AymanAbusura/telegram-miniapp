import { useState, useEffect } from 'react';
import useBalance from "../hooks/useBalance";
import MenuBar from './MenuBar';
import coinImg from "../assets/coin.png";
import { ArrowUp, ArrowLeftRight } from 'lucide-react';

import AnimatedModal from "../components/AnimatedModal";
import WithdrawForm from "../components/WithdrawForm";

const Profile = () => {
  const [currentTab, setCurrentTab] = useState("Profile");
  const [balance, setBalance] = useBalance();

  const [userName, setUserName] = useState("");
  const [startDate, setStartDate] = useState("");

  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      const user = tg.initDataUnsafe.user;
      const name = user.first_name || user.last_name || "Guest";
      setUserName(name);
    } else {
      setUserName("Guest");
    }

    const savedDate = localStorage.getItem("startDate");
    if (savedDate) {
      setStartDate(savedDate);
    } else {
      const today = new Date();
      const formatted = today.toLocaleDateString("en-GB").replace(/\//g, ".");
      setStartDate(formatted);
      localStorage.setItem("startDate", formatted);
    }
  }, []);

  const handleWithdrawClick = () => {
    setShowWithdrawForm(true);
    setErrorMessage("");
    setWithdrawAmount("");
  };

  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount)) {
      setErrorMessage("Please enter a valid number.");
      return;
    }

    if (amount < 200000) {
      setErrorMessage("Minimum payout amount 200000$");
      return;
    }

    if (amount > balance) {
      setErrorMessage("You don't have enough money.");
      return;
    }

    setBalance(prev => prev - amount);
    setShowWithdrawForm(false);
    setErrorMessage("");
    alert(`Withdrawal successful: $${amount}`);
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="user-info">
          <h1 className="user-name">{userName}</h1>
          <p className="start-date">Started playing on – {startDate}</p>
        </div>
      </header>

      <section className="balance-section">
        <p className="section-title">Funds in balance</p>
        <div className="balance-display">
          <span className="balance-amount">{balance.toFixed(2)}</span>
          <img src={coinImg} alt="Coin" className="profile-coin" />
        </div>
        <p className="balance-huf-equivalent">{balance.toFixed(2)} $</p>
      </section>

      <div className="action-buttons-wrapper">
        <div className="action-button primary-action" onClick={handleWithdrawClick}>
          <ArrowUp className="button-icon" />
          <span className="button-text">Withdrawal</span>
        </div>
        <div className="action-button secondary-action disabled">
          <ArrowLeftRight className="button-icon secondary-icon" />
          <span className="button-text secondary-text">Exchange</span>
        </div>
      </div>

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

      <section className="statistics-section">
        <h2 className="section-title statistics-title">Statistical data</h2>
        <div className="stats-card">
          <div className="stats-content">
            <div className='fingerup-icon'>👆</div>
            <div>
              <span className="stats-text">Refresh</span>
              <div className="level-info">
                <img src={coinImg} alt="Coin" className="benefit-level-coin" />
                5 / Level
              </div>
            </div>
          </div>
        </div>
      </section>

      <MenuBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default Profile;