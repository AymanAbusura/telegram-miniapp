// import { useState } from "react";
// import { ChevronRight } from "lucide-react";
// import channelProfile from "../assets/channel_profile.webp";
// import { openTelegram } from '../utils/openTelegram';
// import texts from "../data/texts.json";

// export default function UpdateCard({ onClose, setSubscribed }) {
//     const content = texts.updateCard;

//     const [checking, setChecking] = useState(false);

//     const handleCheckSubscription = async () => {
//         setChecking(true);

//         try {
//             const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
//             if (!userId) return alert("Please open this in Telegram WebApp.");

//             const res = await fetch(`${process.env.REACT_APP_API_URL}/check-subscription/${userId}`);
//             const data = await res.json();

//             setSubscribed(data.subscribed);
//             alert(data.subscribed ? "You are subscribed ✅" : "You are not subscribed ❌");
//         } catch (err) {
//             console.error(err);
//             alert("Error checking subscription.");
//         } finally {
//             setChecking(false);
//         }
//     };

//     const handleSubscribeClick = () => {
//         openTelegram(process.env.REACT_APP_TELEGRAM_LINK);

//         setTimeout(() => {
//             handleCheckSubscription();
//         }, 5000);
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
//                     onClick={handleSubscribeClick}
//                 >
//                     {content.subscribe}
//                 </button>

//                 <button
//                     className="amount-submit-button check-update-button"
//                     onClick={handleCheckSubscription}
//                     disabled={checking}
//                 >
//                     {checking ? "Checking..." : `${content.check}`}
//                 </button>
//             </div>
//         </>
//     );
// }

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import channelProfile from "../assets/channel_profile.webp";
import { openTelegram } from '../utils/openTelegram';
import texts from "../data/texts.json";

export default function UpdateCard({ onClose, setSubscribed }) {
    const content = texts.updateCard;

    const [checking, setChecking] = useState(false);
    const [channelImage, setChannelImage] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/channel-photo`)
            .then(res => res.json())
            .then(data => {
                if (data.url) setChannelImage(data.url);
            })
            .catch(err => console.error(err));
    }, []);

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

    const handleSubscribeClick = () => {
        openTelegram(process.env.REACT_APP_TELEGRAM_LINK);

        setTimeout(() => {
            handleCheckSubscription();
        }, 5000);
    };

    return (
        <>
            <img
                src={channelImage || channelProfile}
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
                    onClick={handleSubscribeClick}
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