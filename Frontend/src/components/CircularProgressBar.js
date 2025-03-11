import React, { useEffect, useState } from "react";
import "./CircularProgressBar.css";

const CircularProgressBar = ({ percentage, color }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - (percentage || 0)) / 100) * circumference;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 10); // Reset and restart animation
  }, [percentage]);

  const circleStyle = { "--circumference": circumference, "--progress": progress, "--color": color };

  return (
    <div className="circular-progressbar">
      <svg viewBox="0 0 100 100">
        <circle className="circle bg" r={radius} cx="50" cy="50" strokeDasharray={circumference} style={circleStyle} />
        <circle
          className={`circle ${isAnimating ? "animating" : ""}`}
          r={radius}
          cx="50"
          cy="50"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={circleStyle}
        />
      </svg>
      <div className="percentage">{percentage || 0}%</div>
    </div>
  );
};

export default CircularProgressBar;