import React from "react";
import MentorCard from "./mentorCard";

const PopularMentors = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Popular Instructors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(5).fill(<MentorCard />)}
      </div>
    </div>
  );
};

export default PopularMentors;
