"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const BACKGROUNDS = [
  "/backgrounds/bg-1.webp",
  "/backgrounds/bg-2.webp",
  "/backgrounds/bg-3.webp",
];

export default function RotatingBackground() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);

  const isHighVisibilityRoute =
    pathname === "/login" || pathname === "/student/dashboard" || pathname === "/admin/dashboard";

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BACKGROUNDS.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms] ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
          data-active={index === i ? "true" : "false"}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: isHighVisibilityRoute
            ? "linear-gradient(180deg, rgba(255,250,240,0.45), rgba(255,245,220,0.55))"
            : "linear-gradient(180deg, rgba(255,250,240,0.72), rgba(255,245,220,0.8))",
        }}
      />
      <div
        className="scrolling-bg absolute inset-0"
        style={{ opacity: isHighVisibilityRoute ? 0.45 : 0.25 }}
      />
    </div>
  );
}
