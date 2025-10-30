// import { ChevronRight } from "lucide-react";
// import channelProfile from "../assets/channel_profile.webp";
// import { openTelegram } from '../utils/openTelegram';

// export default function UpdateCard({ onClose }) {
//     return (
//         <>
//             <img
//                 src={channelProfile}
//                 alt="Channel Profile"
//                 className="channel-profile-image"
//             />

//             <div className="card-header">
//                 <h2>Crypto Expert</h2>
//                 <p>Subscribe to the sponsor’s channel and win a bonus!</p>
//             </div>

//             <div className="energy-update-card">
//                 <div className="energy-info-update">⚡ 30</div>
//                 <ChevronRight size={20} />
//                 <div className="energy-info-update">⚡ 60</div>
//             </div>

//             <div className="update-buttons">
//                 <button 
//                     className="amount-submit-button subscribe-update-button"
//                     onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
//                 >
//                     Subscribe
//                 </button>

//                 <button
//                     onClick={onClose}
//                     className="amount-submit-button check-update-button"
//                 >
//                     Check it
//                 </button>
//             </div>
//         </>
//     );
// }

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import channelProfile from "../assets/channel_profile.webp";
import { openTelegram } from "../utils/openTelegram";

export default function UpdateCard({ onClose }) {
    const [checking, setChecking] = useState(false);
    const [message, setMessage] = useState("");

    const handleCheckSubscription = async () => {
        setChecking(true);
        setMessage("");

        try {
            const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
            if (!user) {
                setMessage("Cannot detect Telegram user.");
                setChecking(false);
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/checkSubscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    channelUsername: process.env.REACT_APP_TELEGRAM_CHANNEL,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage("✅ Subscribed! Energy boosted!");
                window.dispatchEvent(new CustomEvent("energyBoost", { detail: 60 }));
            } else {
                setMessage("❌ You are not subscribed yet.");
            }
        } catch (err) {
            setMessage("Server error. Try again later.");
        }

        setChecking(false);
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
                    onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
                >
                    Subscribe
                </button>

                <button
                    onClick={handleCheckSubscription}
                    className="amount-submit-button check-update-button"
                    disabled={checking}
                >
                    {checking ? "Checking..." : "Check it"}
                </button>
            </div>

            {message && <p className="update-message">{message}</p>}
        </>
    );
}