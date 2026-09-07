import React from 'react';

interface BlueBirdLogoProps {
  className?: string;
  size?: number;
}

export const BlueBirdLogo: React.FC<BlueBirdLogoProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sleek Blue Bird Vector */}
      <path
        d="M78 28C68 25 54 30 46 38C38 46 34 56 32 68C42 60 52 58 64 56C58 64 52 72 40 76C56 78 72 70 78 54C82 43 82 34 78 28Z"
        fill="url(#birdGradReact)"
      />
      <path
        d="M22 62C30 52 42 44 54 40C46 48 42 58 40 68C32 68 26 66 22 62Z"
        fill="#38bdf8"
        opacity="0.85"
      />
      <circle cx="68" cy="38" r="3.5" fill="#ffffff" />
      <defs>
        <linearGradient id="birdGradReact" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
