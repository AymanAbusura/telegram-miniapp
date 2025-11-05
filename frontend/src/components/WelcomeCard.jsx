// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import coinImg from "../assets/coin.webp";

// export default function WelcomeCard({ content, subid }) {
//   const navigate = useNavigate();

//   return (
//     <div className="welcome-container">
//       <div className="card-content">
//         <motion.img
//           src={coinImg}
//           alt="Coin"
//           className="welcome-coin"
//           initial={{ scale: 0 }}
//           animate={{
//             scale: 1,
//             y: [0, -20, 0],
//           }}
//           transition={{
//             scale: { type: "spring", stiffness: 100 },
//             y: {
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut",
//             },
//           }}
//         />

//         <h1 className="welcome-header">
//           {content.headerStart}{" "}
//           <span className="highlight">{content.highlight}</span>{" "}
//           {content.headerEnd}
//         </h1>
//         <p className="subtext">{content.subtext}</p>

//         <div>
//           <div className="info-list">
//             {content.infoList.map((item, index) => (
//               <div className="info-item" key={index}>
//                 <span className="icon">{item.icon}</span>
//                 <div>
//                   <p className="info-title">{item.title}</p>
//                   <p className="info-desc">{item.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button className="start-button" onClick={() => navigate("/home")}>
//           {content.buttonText}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import coinImg from "../assets/coin.webp";

export default function WelcomeCard({ content, subid }) {
  const navigate = useNavigate();

  const handleStart = () => {
    // Update URL for React Router
    window.history.pushState({}, "", "/home");
    // Navigate using React Router
    navigate("/home");
  };

  return (
    <div className="welcome-container">
      <div className="card-content">
        <motion.img
          src={coinImg}
          alt="Coin"
          className="welcome-coin"
          initial={{ scale: 0 }}
          animate={{ scale: 1, y: [0, -20, 0] }}
          transition={{
            scale: { type: "spring", stiffness: 100 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <h1 className="welcome-header">
          {content.headerStart}{" "}
          <span className="highlight">{content.highlight}</span>{" "}
          {content.headerEnd}
        </h1>
        <p className="subtext">{content.subtext}</p>

        <div className="info-list">
          {content.infoList.map((item, index) => (
            <div className="info-item" key={index}>
              <span className="icon">{item.icon}</span>
              <div>
                <p className="info-title">{item.title}</p>
                <p className="info-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="start-button" onClick={handleStart}>
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}