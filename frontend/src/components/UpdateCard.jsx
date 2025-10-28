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
                    // onClick={() => {
                    //     const telegramLink = process.env.REACT_APP_TELEGRAM_LINK?.replace(/^https?:\/\//, 'tg://');
                    //     window.location.href = telegramLink;
                    // }}
                    onClick={() => {
    // Получаем username/код канала из ссылки
    const inviteLink = process.env.REACT_APP_TELEGRAM_LINK; // "https://t.me/+nSeKpMWH0dI5N2Mx"
    
    let telegramURL = inviteLink;

    if (inviteLink.includes("t.me/+")) {
      // Это инвайт-ссылка на канал
      const inviteCode = inviteLink.split("+")[1];
      telegramURL = `tg://join?invite=${inviteCode}`;
    } else if (inviteLink.includes("t.me/")) {
      const username = inviteLink.split("t.me/")[1];
      telegramURL = `tg://resolve?domain=${username}`;
    }

    window.location.href = telegramURL;
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