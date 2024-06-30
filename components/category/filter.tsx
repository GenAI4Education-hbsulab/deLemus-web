"use client";

import React, { useState } from "react";

const Filter = () => {
  const subjects = ["Biology", "Chemistry"];

  return (
    <div className="flex flex-col gap-y-2 pr-4">
      <h3 className="text-l border border-t-0 border-l-0 border-r-0 border-b-2 border-black">
        Subject
      </h3>
      <div className="ml-4 button flex flex-col items-start gap-y-1">
        {subjects.map((genre, index) => (
          <button key={genre}>{genre}</button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
