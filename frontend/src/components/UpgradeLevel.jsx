import { ChevronRight } from "lucide-react";
import coinImg from "../assets/coin.webp";

export default function UpgradeLevel({ onClose }) {
    return (
        <>
            <div className="upgrade-image">
                <div className="upgrade-level-icon">👆</div>
                <div className="notification-badge-upgrade">5 LVL</div>
            </div>

            <div className="card-header">
                <h2>Upgrade</h2>
                <p>Level up and earn more money!</p>
                <div className="energy-update-card">
                    <div className="level-info-upgrade">
                        <img src={coinImg} alt="Coin" className="benefit-coin" />
                        5/Level
                    </div>
                    <ChevronRight size={20} />
                    <div className="level-info-upgrade">
                        <img src={coinImg} alt="Coin" className="benefit-coin" />
                        6/Level
                    </div>
                </div>
            </div>

            <div className="upgrade-buttons">
                <div className="money-info-upgrade">
                    39062.5
                    <img src={coinImg} alt="Coin" className="benefit-coin" />
                </div>
                <button 
                    className="amount-submit-button subscribe-update-button"
                    onClick={() => {
                        const telegramLink = process.env.REACT_APP_TELEGRAM_LINK?.replace(/^https?:\/\//, 'tg://');
                        window.location.href = telegramLink;
                    }}
                >
                    Subscribe
                </button>
            </div>
        </>
    );
}