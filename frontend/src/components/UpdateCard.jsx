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

// Added currentMaxEnergy prop to better control the energy boost logic
export default function UpdateCard({ onClose, currentMaxEnergy }) {
    const content = texts.updateCard;

    const [checking, setChecking] = useState(false);
    const [message, setMessage] = useState("");
    const BOOST_AMOUNT = 60; // Define the target max energy

    const handleCheckSubscription = async () => {
        setChecking(true);
        setMessage("");

        try {
            const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
            if (!user) {
                setMessage("Cannot detect Telegram user. Are you running this in the Telegram app?");
                setChecking(false);
                return;
            }

            // Check if the boost has already been applied
            if (currentMaxEnergy >= BOOST_AMOUNT) {
                 setMessage("Maximum energy already increased! Enjoy.");
                 setChecking(false);
                 return;
            }

            // Use the API URL from the frontend .env
            const apiUrl = process.env.REACT_APP_API_URL;
            if (!apiUrl) {
                setMessage("Configuration error: REACT_APP_API_URL is missing.");
                setChecking(false);
                return;
            }

            const response = await fetch(`${apiUrl}/checkSubscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    channelUsername: process.env.REACT_APP_TELEGRAM_CHANNEL,
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { success: false, message: `Invalid server response. Text: ${text.substring(0, 100)}...` };
            }

            // Set the message based on the response
            setMessage(data.message || (data.success ? `✅ Subscribed! Max energy is now ${BOOST_AMOUNT}.` : "❌ Not subscribed. Please subscribe first."));

            // 🔑 Key logic: Dispatch event on success AND if boost is needed
            if (data.success && currentMaxEnergy < BOOST_AMOUNT) {
                // Dispatch event to Home.jsx to update energy to 60/60
                window.dispatchEvent(new CustomEvent("energyBoost", { detail: BOOST_AMOUNT })); 
            }
        } catch (err) {
            setMessage(`Server error: ${err.message}. Check your console and backend logs.`);
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
                <div className="energy-info-update">**{BOOST_AMOUNT}**</div> {/* Explicitly show the boosted amount */}
            </div>

            <div className="update-buttons">
                <button 
                    className="amount-submit-button subscribe-update-button"
                    onClick={() => openTelegram(process.env.REACT_APP_TELEGRAM_LINK)}
                >
                    {content.subscribe}
                </button>

                <button
                    onClick={handleCheckSubscription}
                    className="amount-submit-button check-update-button"
                    disabled={checking}
                >
                    {checking ? "Checking..." : `${content.check}`}
                </button>
            </div>

            {message && <p className="update-message">{message}</p>}
            <button className="close-button" onClick={onClose}>Close</button> 
        </>
    );
}