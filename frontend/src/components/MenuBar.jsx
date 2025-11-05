import { useNavigate } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { TrendingUp } from "lucide-react";

export default function MenuBar({ currentTab, setCurrentTab, content }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: content.block_1, icon: <FaHome />, path: "/home" },
    { name: content.block_2, icon: <FaBagShopping />, path: "/benefit" },
    { name: content.block_3, icon: <TrendingUp />, path: "/ranking" },
    { name: content.block_4, icon: <FaUser />, path: "/profile" },
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