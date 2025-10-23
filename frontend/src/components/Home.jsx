import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coinImg from "../assets/coin.png";
import { ChevronRight, ArrowUp } from "lucide-react";
import MenuBar from "./MenuBar";
import useBalance from "../hooks/useBalance";

import AnimatedModal from "../components/AnimatedModal";
import WithdrawForm from "../components/WithdrawForm";
import UpdateCard from "../components/UpdateCard";

export default function Home() {
    const [currentTab, setCurrentTab] = useState("Home");

    const [balance, setBalance] = useBalance();
    const [energy, setEnergy] = useState(30);
    const maxEnergy = 30;
    const [floatingTexts, setFloatingTexts] = useState([]);

    const [showWithdrawForm, setShowWithdrawForm] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [showUpdatesCard, setShowUpdatesCard] = useState(false);

    useEffect(() => {
        localStorage.setItem("balance", balance.toFixed(2));
    }, [balance]);

    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy((prev) => (prev < maxEnergy ? prev + 1 : prev));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCoinClick = () => {
        if (energy > 0) {
            setBalance((prev) => prev + 0.05);
            setEnergy((prev) => prev - 1);

            const id = Math.random().toString(36).substr(2, 9);
            setFloatingTexts((prev) => [...prev, { id, text: "+0.05" }]);

            setTimeout(() => {
                setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
            }, 1000);
        }
    };

    const handleWithdrawSubmit = () => {
        const amount = parseFloat(withdrawAmount);

        if (isNaN(amount)) {
            setErrorMessage("Please enter a valid number.");
            return;
        }

        if (amount < 200000) {
            setErrorMessage("Minimum payout amount 200000$");
            return;
        }

        if (amount > balance) {
            setErrorMessage("You don't have enough money.");
            return;
        }

        setBalance((prev) => prev - amount);
        setShowWithdrawForm(false);
        setErrorMessage("");
        alert(`Withdrawal successful: $${amount}`);
    };

    useEffect(() => {
        document.body.classList.add("no-scroll");

        return () => {
        document.body.classList.remove("no-scroll");
        };
    }, []);

    return (
        <div className="home-container">
            <div className="home-header">
                <div className="withdraw-box">
                    <button className="withdraw-button" onClick={() => setShowWithdrawForm(true)}>
                        <span className="withdraw-icon">
                            <ArrowUp size={18} style={{ color: "white" }} />
                        </span>
                        Withdraw
                    </button>
                </div>
            </div>

            <AnimatedModal
                isOpen={showWithdrawForm}
                onClose={() => setShowWithdrawForm(false)}
                from="top"
                wrapperClass="withdraw-form-container"
            >
                <WithdrawForm
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    handleWithdrawSubmit={handleWithdrawSubmit}
                    errorMessage={errorMessage}
                />
            </AnimatedModal>
            
            <AnimatedModal
                isOpen={showUpdatesCard}
                onClose={() => setShowUpdatesCard(false)}
                from="bottom"
                wrapperClass="updates-card-container"
            >
                <UpdateCard onClose={() => setShowUpdatesCard(false)} />
            </AnimatedModal>

            <div className="balance-section" style={{ position: "relative" }}>
                <h1 className="balance">
                    {balance.toFixed(2)} <span className="home-currency">$</span>
                </h1>

                <AnimatePresence>
                    {floatingTexts.map((ft) => (
                        <motion.div
                            key={ft.id}
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 0, y: -50 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            style={{
                                position: "absolute",
                                bottom: "150px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                color: "white",
                                fontSize: "42px",
                                fontWeight: "900",
                                pointerEvents: "none",
                                zIndex: 10,
                            }}
                        >
                            {ft.text}
                        </motion.div>
                    ))}
                </AnimatePresence>

                <motion.img
                    src={coinImg}
                    alt="Coin"
                    className="home-coin"
                    onClick={handleCoinClick}
                    whileTap={{ scale: 1.2 }}
                />
            </div>

            <div>
                <div className="energy-section">
                    <div className="energy-info">⚡ {energy}/{maxEnergy}</div>
                    <button className="updates-btn" onClick={() => setShowUpdatesCard(true)}>
                        🚀 Updates
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="energy-bar">
                    <div
                        className="energy-fill"
                        style={{ width: `${(energy / maxEnergy) * 100}%` }}
                    ></div>
                </div>
            </div>

            <MenuBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
    );
}