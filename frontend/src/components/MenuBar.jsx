import { useNavigate } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { TrendingUp } from "lucide-react";

export default function MenuBar({ currentTab, setCurrentTab }) {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/Home" },
    { name: "Benefit", icon: <FaBagShopping />, path: "/Benefit" },
    { name: "Ranking", icon: <TrendingUp />, path: "/Ranking" },
    { name: "Profile", icon: <FaUser />, path: "/Profile" },
  ];

  return (
    <div className="menu-bar">
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`menu-item ${currentTab === item.name ? "active" : ""}`}
          onClick={() => {
            setCurrentTab(item.name);
            navigate(item.path);
          }}
        >
          <div className="menu-icon">{item.icon}</div>
          <div className="menu-text">{item.name}</div>
        </div>
      ))}
    </div>
  );
}