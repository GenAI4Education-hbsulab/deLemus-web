import React from "react";

const Header = () => {
  return (
    <header className="p-4 bg-white shadow flex justify-between items-center">
      <h1 className="text-xl font-semibold">Welcome, [User Name]!</h1>
      <nav className="flex space-x-4">
        <a href="#" className="text-gray-700 hover:text-blue-500">
          Home
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-500">
          Programs
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-500">
          My Courses
        </a>
        <a href="#" className="text-gray-700 hover:text-blue-500">
          Saved
        </a>
      </nav>
    </header>
  );
};

export default Header;
