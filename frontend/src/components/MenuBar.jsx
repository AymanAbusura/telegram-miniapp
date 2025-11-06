import { useNavigate } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { TrendingUp } from "lucide-react";

export default function MenuBar({ currentTab, setCurrentTab, content }) {
  const navigate = useNavigate();

  const menuItems = [
    { key: "home", name: content.block_1, icon: <FaHome />, path: "/home" },
    { key: "benefit", name: content.block_2, icon: <FaBagShopping />, path: "/benefit" },
    { key: "ranking", name: content.block_3, icon: <TrendingUp />, path: "/ranking" },
    { key: "profile", name: content.block_4, icon: <FaUser />, path: "/profile" },
  ];

  return (
    <div className="menu-bar">
      {menuItems.map((item) => (
        <div
          key={item.key}
          className={`menu-item ${currentTab === item.key ? "active" : ""}`}
          onClick={() => {
            setCurrentTab(item.key);
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