import { ChevronRight } from "lucide-react";
import channelProfile from "../assets/channel_profile.webp";

export default function UpdateCard({ onClose }) {
    const handleTelegramClick = () => {
        const inviteLink = process.env.REACT_APP_TELEGRAM_LINK;
        let tgLink;

        if (inviteLink.includes("t.me/+")) {
            const inviteCode = inviteLink.split("+")[1];
            tgLink = `tg://join?invite=${inviteCode}`;
        } else if (inviteLink.includes("t.me/")) {
            const username = inviteLink.split("t.me/")[1];
            tgLink = `tg://resolve?domain=${username}`;
        } else {
            tgLink = inviteLink;
        }

        const a = document.createElement("a");
        a.href = tgLink;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
            window.open(inviteLink, "_blank");
        }, 1000);
    };

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
                    onClick={handleTelegramClick}
                    // onClick={() => {
                    //     const telegramLink = process.env.REACT_APP_TELEGRAM_LINK?.replace(/^https?:\/\//, 'tg://');
                    //     window.location.href = telegramLink;
                    // }}
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