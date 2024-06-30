import React from "react";

const CourseCard = () => {
  return (
    <div className="border p-4 rounded shadow">
      <img
        src="https://via.placeholder.com/150"
        alt="Course"
        className="mb-2 rounded"
      />
      <h3 className="font-semibold mb-1">Beginner Guide to Design</h3>
      <p className="text-sm text-gray-600 mb-1">Instructor Name</p>
      <p className="text-sm text-yellow-500 mb-2">★★★★★</p>
      <p className="text-lg font-semibold">$149.99</p>
    </div>
  );
};

export default CourseCard;
