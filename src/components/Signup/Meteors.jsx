import React from "react";
import "../styles/meteors.css"

export const Meteors = ({ number = 20 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: number }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white w-0.5 h-2 opacity-70 animate-fall"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};
