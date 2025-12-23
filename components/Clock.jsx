"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setMounted(true);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    function updateClock() {
      const now = new Date();
      let hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hour < 12 ? " AM" : " PM";

      if (hour === 0) hour = 12;
      else if (hour > 12) hour -= 12;

      const formattedTime = `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}${ampm}`;
      const formattedDate = `${weekdayNames[now.getDay()]}, ${
        monthNames[now.getMonth()]
      } ${now.getDate()}, ${now.getFullYear()}`;

      setTime(formattedTime);
      setDate(formattedDate);
    }

    updateClock(); // initial call
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);
  if (!mounted) return null;

  return (
    <div className="clock">
      <div id="time">{time}</div>
      <div id="date">{date}</div>
    </div>
  );
}
