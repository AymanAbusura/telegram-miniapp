import { useState, useEffect } from 'react';
import useBalance from "../hooks/useBalance";
import MenuBar from './MenuBar';
import coinImg from "../assets/coin.webp";
import { ArrowUp, ArrowLeftRight } from 'lucide-react';

import AnimatedModal from "../components/AnimatedModal";
import WithdrawForm from "../components/WithdrawForm";

const Profile = ({ content }) => {
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
      const name = user.first_name || user.last_name || content.guest_name;
      setUserName(name);
    } else {
      setUserName(content.guest_name);
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
      setErrorMessage(content.withdraw_error_invalid);
      return;
    }

    if (amount < 200000) {
      setErrorMessage(content.withdraw_error_minimum);
      return;
    }

    if (amount > balance) {
      setErrorMessage(content.withdraw_error_balance);
      return;
    }

    setBalance(prev => prev - amount);
    setShowWithdrawForm(false);
    setErrorMessage("");
    alert(`${content.withdraw_success}${amount}`);
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
          <p className="start-date">{content.started_playing} {startDate}</p>
        </div>
      </header>

      <section className="balance-section">
        <p className="section-title">{content.funds_in_balance}</p>
        <div className="balance-display">
          <span className="balance-amount">{balance.toFixed(2)}</span>
          <img src={coinImg} alt="Coin" className="profile-coin" />
        </div>
        <p className="balance-huf-equivalent">{balance.toFixed(2)} $</p>
      </section>

      <div className="action-buttons-wrapper">
        <div className="action-button primary-action" onClick={handleWithdrawClick}>
          <ArrowUp className="button-icon" />
          <span className="button-text">{content.withdrawal_button}</span>
        </div>
        <div className="action-button secondary-action disabled">
          <ArrowLeftRight className="button-icon secondary-icon" />
          <span className="button-text secondary-text">{content.exchange_button}</span>
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
          content={content.withdrawForm}
        />
      </AnimatedModal>

      <section className="statistics-section">
        <h2 className="section-title statistics-title">{content.statistics_title}</h2>
        <div className="stats-card">
          <div className="stats-content">
            <div className='fingerup-icon'>👆</div>
            <div>
              <span className="stats-text">{content.refresh_label}</span>
              <div className="level-info">
                <img src={coinImg} alt="Coin" className="benefit-level-coin" />
                {content.level_info}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MenuBar currentTab={currentTab} setCurrentTab={setCurrentTab} content={content.menubar} />
    </div>
  );
};

export default Profile;