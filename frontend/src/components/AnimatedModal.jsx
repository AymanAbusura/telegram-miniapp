import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AnimatedModal({
    isOpen,
    onClose,
    children,
    wrapperClass,
    from = "bottom"
}) {
    const direction = from === "top" ? "-100%" : "100%";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: direction, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: direction, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={wrapperClass}
                >
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>

                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}