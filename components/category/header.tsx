import React from "react";
import { Button } from "@/components/button";

const Header = () => {
  return (
    <header className="p-4 bg-white shadow flex flex-wrap justify-between items-center">
      <div className="flex flex-1 items-center space-x-4 mb-4 md:mb-0 px-4">
        <select className="border p-2 rounded w-full md:w-auto">
          <option>Categories</option>
          <option>Design</option>
          <option>Development</option>
        </select>
        <input
          type="text"
          placeholder="Search courses"
          className="border p-2 rounded flex-grow w-full md:w-64"
        />
        <Button className="px-4 rounded w-full md:w-auto">Search</Button>
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end p-4">
        <Button className="rounded w-full md:w-auto">Wishlist</Button>
        <Button className="rounded w-full md:w-auto">Cart</Button>
      </div>
    </header>
  );
};

export default Header;
