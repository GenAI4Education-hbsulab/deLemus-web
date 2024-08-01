import React from "react";
import { Button } from "@/components/button";
import { ICourse } from "./courseSection";

const CourseCard = ({ title, image, buttonText }: ICourse) => {
  return (
    <div className="bg-white shadow p-6 rounded-lg flex flex-col justify-between">
      <img src={image} alt={title} className="rounded mb-4 mx-auto" />
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <Button className="mt-auto">{buttonText}</Button>
      </div>
    </div>
  );
};

export default CourseCard;
