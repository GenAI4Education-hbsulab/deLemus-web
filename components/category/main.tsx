import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import CourseGrid from "./courseGrid";
import Pagination from "./pagination";
import PopularMentors from "./popularMentors";
import FeaturedCourses from "./featCourses";

const MainPage = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <h1 className="text-3xl font-semibold mb-4">Design Courses</h1>
          <p className="mb-4">All Development Courses</p>
          <div className="flex justify-between mb-4">
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
