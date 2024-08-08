import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center">
      <svg
        width="50"
        height="50"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <circle cx="32" cy="32" r="30" stroke="#2C3E50" strokeWidth="2" />
        <path d="M32 12L40 24H24L32 12Z" fill="#16A085" />
        <path
          d="M28 28C28 25.7909 29.7909 24 32 24C34.2091 24 36 25.7909 36 28C36 30.2091 34.2091 32 32 32C29.7909 32 28 30.2091 28 28Z"
          fill="#16A085"
        />
        <path
          d="M38 36L26 36"
          stroke="#2980B9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M32 36V44"
          stroke="#2980B9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M26 48L38 48"
          stroke="#2980B9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M32 48V56"
          stroke="#2980B9"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <span className="text-lg font-semibold text-gray-800">HBSULAB</span>
        <span className="text-[10px] text-gray-600 block">
          Innovate & Discover
        </span>
      </div>
    </div>
  );
};

export default Logo;
