"use client";

import { useEffect, useMemo, useState } from "react";

function calculate(target: string) {
  const remaining = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    ended: remaining === 0,
  };
}

export function CourseCountdown({ target, language = "en", compact = false }: { target: string; language?: "th" | "en"; compact?: boolean }) {
  const initial = useMemo(() => calculate(target), [target]);
  const [time, setTime] = useState(initial);

  useEffect(() => {
    const update = () => setTime(calculate(target));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const labels = language === "th" ? ["วัน", "ชั่วโมง", "นาที", "วินาที"] : ["Days", "Hours", "Minutes", "Seconds"];
  if (time.ended) return <p className="course-countdown__ended" role="status">{language === "th" ? "คลาสเริ่มแล้ว" : "The class has started"}</p>;

  return <div className={`course-countdown${compact ? " course-countdown--compact" : ""}`} aria-label={language === "th" ? "เวลาที่เหลือก่อนเริ่มคลาส" : "Time remaining until class starts"}>
    {[time.days, time.hours, time.minutes, time.seconds].map((value, index) => <div key={labels[index]}><strong>{String(value).padStart(2, "0")}</strong><span>{labels[index]}</span></div>)}
  </div>;
}
