import { useNavigate } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { TrendingUp } from "lucide-react";

export default function MenuBar({ currentTab, setCurrentTab, content }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: content.home, icon: <FaHome />, path: "/Home" },
    { name: content.benefit, icon: <FaBagShopping />, path: "/Benefit" },
    { name: content.ranking, icon: <TrendingUp />, path: "/Ranking" },
    { name: content.profile, icon: <FaUser />, path: "/Profile" },
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