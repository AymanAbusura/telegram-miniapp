import { useState, useEffect } from "react";

export default function useBalance() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("balance");
    return saved ? parseFloat(saved) : 0.0;
  });

  useEffect(() => {
    localStorage.setItem("balance", balance.toFixed(2));
  }, [balance]);

  return [balance, setBalance];
}