import { useState } from "react";
import useBalance from "../hooks/useBalance";
import MenuBar from "./MenuBar";

export default function Ranking({ content }) {
  const [currentTab, setCurrentTab] = useState("ranking");
  const [balance] = useBalance();

  const leaderboard = [
    { rank: 1, name: "Pourya Moradi", balance: 0 },
    { rank: 2, name: "Ralph Kennedy", balance: 4.4 },
    { rank: 3, name: "Grazyna Klotz", balance: 2.8 },
    { rank: 4, name: "Tristan Harcourt", balance: 0 },
    { rank: 5, name: "Amador Pedroza", balance: 0 },
    { rank: 6, name: "Amalia Goller", balance: 20 },
    { rank: 7, name: "Leo Munoz", balance: 0 },
    { rank: 8, name: "Armando Lopez", balance: 10 },
    { rank: 9, name: "Martin Fernandez", balance: 0 },
    { rank: 10, name: "Kamila Vill", balance: 500 },
  ];

  const myRank = 474;

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-number gold";
    if (rank === 2) return "rank-number silver";
    if (rank === 3) return "rank-number bronze";
    return "rank-number default";
  };

  return (
    <div className="ranking-container">
      <h2 className="ranking-title">{content.title}</h2>

      <div className="my-rank">
        <div className={getRankClass(myRank)}>{myRank}</div>
        <div className="rank-name">{content.my_rank_label}</div>
        <div className="rank-balance">{balance.toFixed(2)} {content.currency}</div>
      </div>

      <h3 className="leaderboard-title">{content.leaderboard_title}</h3>

      <div className="leaderboard-list">
        {leaderboard.map((player) => (
          <div key={player.rank} className="leaderboard-item">
            <div className={getRankClass(player.rank)}>{player.rank}</div>
            <div className="player-name">{player.name}</div>
            <div className="player-balance">{player.balance} {content.currency}</div>
          </div>
        ))}
      </div>

      <MenuBar currentTab={currentTab} setCurrentTab={setCurrentTab} content={content.menubar} />
    </div>
  );
}