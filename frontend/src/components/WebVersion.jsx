import texts from "../data/texts.json";

const WebVersion = () => {
    const content = texts.desktop;

    return (
        <div className="desktop-container">
            <div className="desktop-card">
                <div className="phone-emoji">📱</div>
                <h1 className="desktop-title">{content.title}</h1>
                <p className="desktop-text">{content.description}</p>

                <div className="qr-box">
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?data=https://t.me/hyper561_bot/app&size=120x120"
                        alt="Open on phone QR"
                        className="qr-image"
                    />
                    <p className="qr-label">{content.qrLabel}</p>
                </div>
            </div>
        </div>
    );
};

export default WebVersion;