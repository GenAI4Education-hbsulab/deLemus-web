import React from "react";
import CourseCard from "./courseCard";

const CourseGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(12).fill(<CourseCard />)}
    </div>
  );
};

export default CourseGrid;
