// import { ChevronRight } from "lucide-react";
// import channelProfile from "../assets/channel_profile.webp";
// import { openTelegram } from '../utils/openTelegram';
// import texts from "../data/texts.json";

// export default function UpdateCard({ onClose }) {
//     const content = texts.updateCard;

//     return (
//         <>
//             <img
//                 src={channelProfile}
//                 alt="Channel Profile"
//                 className="channel-profile-image"
//             />

//             <div className="card-header">
//                 <h2>{content.title}</h2>
//                 <p>{content.description}</p>
//             </div>

//             <div className="energy-update-card">
//                 <div className="energy-info-update">{content.energy_min}</div>
//                 <ChevronRight size={20} />
//                 <div className="energy-info-update">{content.energy_max}</div>
//             </div>

//             <div className="update-buttons">
//                 <button 
//                     className="amount-submit-button subscribe-update-button"
//                     onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
//                 >
//                     {content.subscribe}
//                 </button>

//                 <button
//                     onClick={onClose}
//                     className="amount-submit-button check-update-button"
//                 >
//                     {content.check}
//                 </button>
//             </div>
//         </>
//     );
// }


import { useState } from "react";
import { openTelegram } from "../utils/openTelegram";

export default function UpdateCard({ onClose }) {
  const [checking, setChecking] = useState(false);
  const [subscribed, setSubscribed] = useState(null);

  const handleCheckSubscription = async () => {
    setChecking(true);

    try {
      const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (!userId) return alert("Please open this in Telegram WebApp.");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/check-subscription/${userId}`);
      const data = await res.json();

      setSubscribed(data.subscribed);
      alert(data.subscribed ? "You are subscribed ✅" : "You are not subscribed ❌");
    } catch (err) {
      console.error(err);
      alert("Error checking subscription.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
        <img
            src={channelProfile}
            alt="Channel Profile"
            className="channel-profile-image"
        />

        <div className="card-header">
            <h2>{content.title}</h2>
            <p>{content.description}</p>
        </div>

        <div className="energy-update-card">
            <div className="energy-info-update">{content.energy_min}</div>
            <ChevronRight size={20} />
            <div className="energy-info-update">{content.energy_max}</div>
        </div>

        <div className="update-buttons">
            <button 
                className="amount-submit-button subscribe-update-button"
                onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
            >
                {content.subscribe}
            </button>

            <button
                className="amount-submit-button check-update-button"
                onClick={handleCheckSubscription}
                disabled={checking}
            >
                {checking ? "Checking..." : `${content.check}`}
            </button>
        </div>
    </>
  );
}