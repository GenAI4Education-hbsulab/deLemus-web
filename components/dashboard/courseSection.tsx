import React from "react";
import CourseCard from "./courseCard";

export interface ICourse {
  title: string;
  image: string;
  buttonText: string;
}
const CoursesSection = ({
  title,
  courses,
}: {
  title: string;
  courses: ICourse[];
}) => {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            image={course.image}
            buttonText={course.buttonText}
          />
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
