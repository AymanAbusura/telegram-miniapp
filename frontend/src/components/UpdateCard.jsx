import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { openTelegram } from '../utils/openTelegram';
import texts from "../data/texts.json";

export default function UpdateCard({ setSubscribed }) {
    const content = texts.updateCard;

    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(false);
    const [channelInfo, setChannelInfo] = useState({
        title: "",
        description: "",
        photo: "",
    });

    const handleCheckSubscription = async () => {
        setChecking(true);

        try {
            const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
            if (!userId) return alert(content.alert_message);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/check-subscription/${userId}`);
            const data = await res.json();

            // PRIVATE CHANNEL
            if (data.error) {
                alert(data.error);
            } else {
                setSubscribed(data.subscribed);
                localStorage.setItem("subscribed", data.subscribed ? "true" : "false");
                alert(data.subscribed ? `${content.subscribed}` : `${content.notSubscribed}`);
            }

            // PUBLIC CHANNEL
            // setSubscribed(data.subscribed);
            // localStorage.setItem("subscribed", data.subscribed ? "true" : "false");
            // alert(data.subscribed ? `${content.subscribed}` : `${content.notSubscribed}`);
        } catch (err) {
            console.error(err);
            alert(content.error_message);
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
    
    useEffect(() => {
        const cachedInfo = localStorage.getItem("channelInfo");

        if (cachedInfo) {
            setChannelInfo(JSON.parse(cachedInfo));
            setLoading(false);
        }

        const fetchChannelInfo = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/channel-info`);
                const data = await res.json();

                setChannelInfo(data);
                localStorage.setItem("channelInfo", JSON.stringify(data));
            } catch (err) {
                console.error(content.channel_info_error, err);
            } finally {
                setLoading(false);
            }
        };

        if (!cachedInfo) {
        fetchChannelInfo();
        }
    }, []);

    return (
        <>
            {loading ? (
                <div className="channel-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-text title"></div>
                    <div className="skeleton-text description"></div>
                </div>
            ) : (
                <>
                    {channelInfo.photo ? (
                        <img
                            src={channelInfo.photo}
                            alt="Channel Profile"
                            className="channel-profile-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                setChannelInfo((prev) => ({ ...prev, photo: "" }));
                            }}
                        />
                    ) : (
                        <div className="skeleton-image"></div>
                    )}

                    <div className="card-header">
                        <h2>{channelInfo.title}</h2>
                        <p>{channelInfo.description}</p>
                    </div>
                </>
            )}

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
                    {checking ? `${content.Checking}` : `${content.check}`}
                </button>
            </div>
        </>
    );
}