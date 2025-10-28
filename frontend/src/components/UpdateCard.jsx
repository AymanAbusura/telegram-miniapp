import { ChevronRight } from "lucide-react";
import channelProfile from "../assets/channel_profile.webp";

export default function UpdateCard({ onClose }) {
    return (
        <>
            <img
                src={channelProfile}
                alt="Channel Profile"
                className="channel-profile-image"
            />

            <div className="card-header">
                <h2>Crypto Expert</h2>
                <p>Subscribe to the sponsor’s channel and win a bonus!</p>
            </div>

            <div className="energy-update-card">
                <div className="energy-info-update">⚡ 30</div>
                <ChevronRight size={20} />
                <div className="energy-info-update">⚡ 60</div>
            </div>

            <div className="update-buttons">
                <button 
                    className="amount-submit-button subscribe-update-button"
                    // onClick={() => window.open(process.env.REACT_APP_TELEGRAM_LINK, "_blank")}
                    onClick={() => {
                        const telegramLink = process.env.REACT_APP_TELEGRAM_LINK;
                        window.location.href = telegramLink;
                    }}
                >
                    Subscribe
                </button>

                <button
                    onClick={onClose}
                    className="amount-submit-button check-update-button"
                >
                    Check it
                </button>
            </div>
        </>
    );
}