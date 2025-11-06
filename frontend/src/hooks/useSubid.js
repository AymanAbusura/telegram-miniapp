// src/hooks/useSubid.js
import { useEffect, useState } from "react";

export default function useSubid() {
  const [subid, setSubid] = useState(() => {
    // попробуем взять из localStorage, если уже был
    return localStorage.getItem("keitaro_subid") || "";
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("subid");

    if (fromUrl) {
      setSubid(fromUrl);
      localStorage.setItem("keitaro_subid", fromUrl);
    }
  }, []);

  return subid;
}