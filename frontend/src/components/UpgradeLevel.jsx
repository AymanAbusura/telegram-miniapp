import { ChevronRight } from "lucide-react";
import coinImg from "../assets/coin.webp";
import { openTelegram } from '../utils/openTelegram';

export default function UpgradeLevel({ onClose, content }) {
    return (
        <>
            <div className="upgrade-image">
                <div className="upgrade-level-icon">{content.icon}</div>
                <div className="notification-badge-upgrade">{content.notification}</div>
            </div>

            <div className="card-header">
                <h2>{content.title}</h2>
                <p>{content.description}</p>
                <div className="energy-update-card">
                    <div className="level-info-upgrade">
                        <img src={coinImg} alt="Coin" className="benefit-coin" />
                        {content.level_min}
                    </div>
                    <ChevronRight size={20} />
                    <div className="level-info-upgrade">
                        <img src={coinImg} alt="Coin" className="benefit-coin" />
                        {content.level_max}
                    </div>
                </div>
            </div>

            <div className="upgrade-buttons">
                <div className="money-info-upgrade">
                    {content.cost}
                    <img src={coinImg} alt="Coin" className="benefit-coin" />
                </div>
                <button 
                    className="amount-submit-button subscribe-update-button"
                    onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
                >
                    {content.subscribe}
                </button>
            </div>
        </>
    );
}