import React from "react";
import CourseCard from "./courseCard";

const FeaturedCourses = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(4).fill(<CourseCard />)}
      </div>
    </div>
  );
};

export default FeaturedCourses;
