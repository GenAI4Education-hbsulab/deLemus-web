import CoursesSection from "@/components/dashboard/courseSection";
import Header from "@/components/dashboard/header";
import LearningTracker from "@/components/dashboard/learningTracker";
import React from "react";

const Dashboard = () => {
  const ongoingCourses = [
    {
      title: "A Visual Introduction to Algorithms",
      image: "https://via.placeholder.com/150",
      buttonText: "Continue Learning",
    },
  ];

  const recommendedCourses = [
    {
      title: "Machine Learning ",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
    {
      title: "Mastering Kotlin Essentials",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
    {
      title: "Foundations in Python",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
  ];

  const freeCourses = [
    {
      title: "Learn to Code from Scratch",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
    {
      title: "Learn SQL from Scratch",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
    {
      title: "Data Science Handbook",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
  ];

  const popularCourses = [
    {
      title: "Introduction to AWS",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
    {
      title: "Advanced AWS Certification",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
    {
      title: "Serverless Applications",
      image: "https://via.placeholder.com/150",
      buttonText: "Get Started",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6">
        <LearningTracker />
        <CoursesSection
          title="Recommended for you"
          courses={recommendedCourses}
        />
        <CoursesSection title="Free Picks for You" courses={freeCourses} />
        <CoursesSection
          title="Popular Courses for You"
          courses={popularCourses}
        />
      </div>
    </div>
  );
};

export default Dashboard;
