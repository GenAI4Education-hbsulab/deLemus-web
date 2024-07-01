import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button className="border p-2 rounded mx-1">Previous</button>
      <button className="border p-2 rounded mx-1">1</button>
      <button className="border p-2 rounded mx-1">2</button>
      <button className="border p-2 rounded mx-1">Next</button>
    </div>
  );
};

export default Pagination;
