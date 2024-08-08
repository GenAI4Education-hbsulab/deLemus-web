import { Button } from "@/components/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <section className="hero text-center py-16 bg-blue-100">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
          Unlock Your Potential with HBSULAB
        </h1>
        <p className="mb-6 text-xl text-gray-700">
          Discover a variety of advanced courses in biology and chemistry.
        </p>
        <Link href="/student/dashboard">
          <Button className="p-8 text-white rounded-lg text-lg font-bold">
            Start Learning Now
          </Button>
        </Link>
      </section>

      <section className="statistics grid grid-cols-2 md:grid-cols-4 gap-4 py-8 bg-gray-50">
        <div className="stat text-center">
          <h3 className="text-4xl font-semibold">250+</h3>
          <p className="text-gray-700">Instructors</p>
        </div>
        <div className="stat text-center">
          <h3 className="text-4xl font-semibold">1000+</h3>
          <p className="text-gray-700">Courses</p>
        </div>
        <div className="stat text-center">
          <h3 className="text-4xl font-semibold">15+</h3>
          <p className="text-gray-700">Categories</p>
        </div>
        <div className="stat text-center">
          <h3 className="text-4xl font-semibold">2400+</h3>
          <p className="text-gray-700">Students</p>
        </div>
      </section>

      <section className="categories text-center p-8">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Top Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="category p-8 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Astrology"
              className="mb-2"
            />
            <p className="text-xl font-bold text-gray-700">
              Biochemistry & Physics
            </p>
            <p className="text-gray-600">11 Courses</p>
          </div>
          <div className="category p-8 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Development"
              className="mb-2"
            />
            <p className="text-xl font-bold text-gray-700">
              Genetic Engineering
            </p>
            <p className="text-gray-600">12 Courses</p>
          </div>
          <div className="category p-8 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Marketing"
              className="mb-2"
            />
            <p className="text-xl font-bold text-gray-700">Organic Chemistry</p>
            <p className="text-gray-600">14 Courses</p>
          </div>
          <div className="category p-8 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Physics"
              className="mb-2"
            />
            <p className="text-xl font-bold text-gray-700">Molecular Biology</p>
            <p className="text-gray-600">10 Courses</p>
          </div>
        </div>
      </section>

      <section className="courses text-center p-8">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Top Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="course bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/200x150"
              alt="Course Image"
              className="rounded mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Advanced Biochemistry
            </p>
            <p className="text-yellow-500">4.5 ⭐</p>
            <p className="text-gray-600">By Ronald Richards</p>
            <p className="text-gray-600">
              22 Total Hours, 155 Lectures, Beginner
            </p>
            <p className="text-xl font-bold text-gray-900">$129.9</p>
          </div>
          <div className="course bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/200x150"
              alt="Course Image"
              className="rounded mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Biomedical & Genetic Engineering
            </p>
            <p className="text-yellow-500">2.8 ⭐</p>
            <p className="text-gray-600">By Ronald Richards</p>
            <p className="text-gray-600">
              22 Total Hours, 155 Lectures, Beginner
            </p>
            <p className="text-xl font-bold text-gray-900">$129.9</p>
          </div>
          <div className="course bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/200x150"
              alt="Course Image"
              className="rounded mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Organic Chemistry Essentials
            </p>
            <p className="text-yellow-500">3.7 ⭐</p>
            <p className="text-gray-600">By Ronald Richards</p>
            <p className="text-gray-600">
              22 Total Hours, 155 Lectures, Beginner
            </p>
            <p className="text-xl font-bold text-gray-900">$149.9</p>
          </div>
          <div className="course bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/200x150"
              alt="Course Image"
              className="rounded mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Molecular Biology Techniques
            </p>
            <p className="text-yellow-500">4.9 ⭐</p>
            <p className="text-gray-600">By Ronald Richards</p>
            <p className="text-gray-600">
              22 Total Hours, 155 Lectures, Beginner
            </p>
            <p className="text-xl font-bold text-gray-900">$149.9</p>
          </div>
        </div>
      </section>

      <section className="instructors text-center p-8">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Top Instructors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="instructor text-center bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/100"
              alt="Instructor Image"
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Dr. Daniel Richards
            </p>
            <p className="text-gray-600">UI/UX Designer</p>
            <p className="text-yellow-500">4.4 ⭐</p>
            <p className="text-gray-600">2100 Students</p>
          </div>
          <div className="instructor text-center bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/100"
              alt="Instructor Image"
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Dr. Francia Gardner
            </p>
            <p className="text-gray-600">UI/UX Designer</p>
            <p className="text-yellow-500">3.9 ⭐</p>
            <p className="text-gray-600">2320 Students</p>
          </div>
          <div className="instructor text-center bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/100"
              alt="Instructor Image"
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">Dr. Samuel Lee</p>
            <p className="text-gray-600">UI/UX Designer</p>
            <p className="text-yellow-500">1.9 ⭐</p>
            <p className="text-gray-600">2980 Students</p>
          </div>
          <div className="instructor text-center bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://via.placeholder.com/100"
              alt="Instructor Image"
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <p className="text-xl font-bold text-gray-700">
              Dr. Maria Gonzalez
            </p>
            <p className="text-gray-600">UI/UX Designer</p>
            <p className="text-yellow-500">4.2 ⭐</p>
            <p className="text-gray-600">3420 Students</p>
          </div>
        </div>
      </section>

      <section className="text-center p-16 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center md:text-left">
            <img
              src="https://via.placeholder.com/150"
              alt="Instructor Placeholder"
              className="mb-4 rounded-lg"
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Become an Instructor
            </h2>
            <p className="mb-6 text-lg text-gray-700 text-center">
              Instructors from around the world teach millions of students on
              Byway. We provide the tools and skills to teach what you love.
            </p>
            <Button>Start Your Instructor Journey</Button>
          </div>
          <div className="flex flex-col items-center text-center md:text-left">
            <img
              src="https://via.placeholder.com/150"
              alt="Transform Your Life Placeholder"
              className="mb-4 rounded-lg"
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Educate yourselves
            </h2>
            <p className="mb-6 text-lg text-gray-700 text-center">
              Learners around the world are launching new careers, advancing in
              their fields, and enriching their lives.
            </p>
            <Button>Checkout Courses</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
