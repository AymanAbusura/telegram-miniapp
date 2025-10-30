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

// import { useState } from "react";
// import { ChevronRight } from "lucide-react";
// import channelProfile from "../assets/channel_profile.webp";
// import { openTelegram } from "../utils/openTelegram";
// import texts from "../data/texts.json";

// export default function UpdateCard({ onClose }) {
//     const content = texts.updateCard;

//     const [checking, setChecking] = useState(false);
//     const [message, setMessage] = useState("");

//     const handleCheckSubscription = async () => {
//         setChecking(true);
//         setMessage("");

//         try {
//             const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
//             if (!user) {
//                 setMessage("Cannot detect Telegram user.");
//                 setChecking(false);
//                 return;
//             }

//             const response = await fetch(`${process.env.REACT_APP_API_URL}/checkSubscription`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     userId: user.id,
//                     channelUsername: process.env.REACT_APP_TELEGRAM_CHANNEL,
//                 }),
//             });

//             const text = await response.text(); // get raw response
//             let data;
//             try {
//                 data = JSON.parse(text);
//             } catch {
//                 data = { success: false, message: `Invalid server response: ${text}` };
//             }

//             setMessage(data.message || (data.success ? "✅ Subscribed!" : "❌ Not subscribed"));

//             if (data.success) {
//                 window.dispatchEvent(new CustomEvent("energyBoost", { detail: 60 }));
//             }
//         } catch (err) {
//             setMessage(`Server error: ${err.message}`);
//         } finally {
//             setChecking(false);
//         }
//     };

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
//                     onClick={handleCheckSubscription}
//                     className="amount-submit-button check-update-button"
//                     disabled={checking}
//                 >
//                     {checking ? "Checking..." : `${content.check}`}
//                 </button>
//             </div>

//             {message && <p className="update-message">{message}</p>}
//         </>
//     );
// }

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import channelProfile from "../assets/channel_profile.webp";
import { openTelegram } from "../utils/openTelegram";
import texts from "../data/texts.json";

export default function UpdateCard({ onClose }) {
  const content = texts.updateCard;

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
          channelUsername: process.env.REACT_APP_TELEGRAM_CHANNEL, // numeric ID for private channel
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, message: `Invalid server response: ${text}` };
      }

      if (data.success) {
        setMessage("✅ Subscribed! Energy boosted!");
        // Trigger energy boost event for Home.jsx
        window.dispatchEvent(new CustomEvent("energyBoost", { detail: 60 }));
      } else {
        setMessage("❌ You are not subscribed yet. Please join the channel.");
      }
    } catch (err) {
      setMessage(`Server error: ${err.message}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="update-card">
      {/* Channel Profile */}
      <img
        src={channelProfile}
        alt="Channel Profile"
        className="channel-profile-image"
      />

      {/* Header */}
      <div className="card-header">
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>

      {/* Energy info */}
      <div className="energy-update-card">
        <div className="energy-info-update">{content.energy_min}</div>
        <ChevronRight size={20} />
        <div className="energy-info-update">{content.energy_max}</div>
      </div>

      {/* Buttons */}
      <div className="update-buttons">
        {/* Subscribe button */}
        <button
          className="amount-submit-button subscribe-update-button"
          onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
        >
          {content.subscribe}
        </button>

        {/* Check subscription button */}
        <button
          onClick={handleCheckSubscription}
          className="amount-submit-button check-update-button"
          disabled={checking}
        >
          {checking ? "Checking..." : content.check}
        </button>
      </div>

      {/* Message */}
      {message && <p className="update-message">{message}</p>}
    </div>
  );
}