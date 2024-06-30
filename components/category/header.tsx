import React from "react";
import { Button } from "@/components/button";

const Header = () => {
  return (
    <header className="p-4 bg-white shadow flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <select className="border p-2 rounded">
          <option>Categories</option>
          <option>Design</option>
          <option>Development</option>
        </select>
        <input
          type="text"
          placeholder="Search courses"
          className="border p-2 rounded w-64"
        />
        <Button className="p-2 rounded">Search</Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button className="p-2 rounded">My Courses</Button>
        <Button className="p-2 rounded">Wishlist</Button>
        <Button className="p-2 rounded">Cart</Button>
      </div>
    </header>
  );
};

export default Header;
