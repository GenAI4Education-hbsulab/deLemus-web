"use client";
import React, { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import CourseGrid from "./courseGrid";
import Pagination from "./pagination";
import PopularMentors from "./popularMentors";
import FeaturedCourses from "./featCourses";

const MainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <div
          className={`fixed inset-0 z-30 md:relative md:translate-x-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:flex md:w-64`}
        >
          <Sidebar />
        </div>
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold">Design Courses</h1>
            <button
              className="md:hidden border p-2 rounded z-40 relative"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? "Close" : "Open"} Sidebar
            </button>
          </div>
          <p className="mb-4">All Development Courses</p>
          <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
            <button className="border p-2 rounded">View</button>
            <select className="border p-2 rounded">
              <option>Sort by</option>
              <option>Relevance</option>
            </select>
          </div>
          <CourseGrid />
          <Pagination />
          <PopularMentors />
          <FeaturedCourses />
        </main>
      </div>
    </div>
  );
};

export default MainPage;
