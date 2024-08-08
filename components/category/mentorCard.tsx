import Image from "next/image";
import React from "react";

const MentorCard = () => {
  return (
    <div className="border p-4 rounded shadow flex items-center">
      <Image
        src="https://via.placeholder.com/50"
        width={50}
        height={50}
        alt="Mentor"
        className="rounded-full mr-4"
      />
      <div>
        <h4 className="font-semibold">Ronald Richards</h4>
        <p className="text-xs text-gray-600">UI/UX Instructor</p>
      </div>
    </div>
  );
};

export default MentorCard;
