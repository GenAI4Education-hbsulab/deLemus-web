"use client";

import React from "react";
import Image from "next/image";
import { Link, Star } from "lucide-react";
import { StarHalf } from "lucide-react";
import { array } from "zod";

interface iCourse {
  imageSrc: string;
  courseName: string;
  instructorName: string;
  numberOfRatings: number;
  rating: number;
  price: number;
  href: string;
}

export default function CourseCard(props: iCourse) {
  const {
    imageSrc,
    courseName,
    instructorName,
    numberOfRatings,
    rating,
    price,
    href,
  } = props;
  const ratingRounded = Math.round(rating);

  return (
    <a href={href}>
      <div className="h-auto w-auto border rounded-md shadow-md text-left transition-all hover:scale-105">
        <Image
          src="/public/next.svg"
          height={150}
          width={300}
          alt={courseName}
        />
        <div className="bg-slate-300 p-3">
          <p className="font-bold text-lg">{courseName}</p>
          <p className="text-xs">By {instructorName}</p>
          <div className="flex flex-row align-middle">
            <div className="gap-[4px] flex ">
              {Array.from({ length: ratingRounded }, (d, i) => (
                <Star fill="orange" key={i} />
              ))}

              {Array.from({ length: 5 - ratingRounded }, (d, i) => (
                <Star fill="black" strokeWidth={0} key={i} />
              ))}
            </div>
            <div className="absolute"></div>
            <p className="text-xs align-middle">({numberOfRatings} Ratings)</p>
          </div>
          <p className="font-bold ">${price}</p>
        </div>
      </div>
    </a>
  );
}
