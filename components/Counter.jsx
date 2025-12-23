"use client";
import { useEffect } from "react";

export default function Counter() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://counter1.optistats.ovh/private/counter.js?c=ebh6tyuumhs11afd4hu2qn92mdup393n&down=async";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return <div id="sfcebh6tyuumhs11afd4hu2qn92mdup393n"></div>;
}