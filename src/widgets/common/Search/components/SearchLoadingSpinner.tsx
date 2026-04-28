import React from "react";

const SPOKE_COUNT = 12;

const SearchLoadingSpinner: React.FC = () => (
  <div className="flex justify-center pb-12">
    <div className="relative" style={{ width: "35px", height: "35px" }}>
      {Array.from({ length: SPOKE_COUNT }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "5px",
            height: "7px",
            marginLeft: "-1.5px",
            marginTop: "7px",
            borderRadius: "2px",
            backgroundColor: "#555",
            opacity: (i + 1) / SPOKE_COUNT,
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: "1.5px 15px",
            animation: "starburst 1s steps(12, end) infinite",
            animationDelay: `${-(i / SPOKE_COUNT)}s`,
          }}
        />
      ))}
    </div>
    <style>{`@keyframes starburst { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default SearchLoadingSpinner;
