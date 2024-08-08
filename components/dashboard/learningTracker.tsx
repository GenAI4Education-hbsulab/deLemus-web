import React from "react";
import { Button } from "@/components/button";

const LearningTracker = () => {
  return (
    <div className="bg-white shadow p-6 rounded-lg my-4">
      <h2 className="text-lg font-semibold mb-2">My Learning Tracker</h2>
      <div className="mt-2 flex justify-between items-center">
        <div>
          <p className="font-medium">Current Course:</p>
          <p className="text-gray-700">A Visual Introduction to Algorithms</p>
          <small className="text-gray-500">1 hour left</small>
        </div>
        <Button className="ml-4">Continue Learning</Button>
      </div>
    </div>
  );
};

export default LearningTracker;
