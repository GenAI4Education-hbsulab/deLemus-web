"use client";
import React, { useState } from "react";

type SidebarItem = {
  text: string;
  completed: boolean;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sidebarData: SidebarSection[] = [
  {
    title: "Binary Search",
    items: [
      { text: "Binary Search", completed: true },
      { text: "Implementing Binary Search of an Array", completed: true },
      { text: "Challenge: Binary Search", completed: true },
      { text: "Running Time of Binary Search", completed: true },
      { text: "Quiz: Running time of binary search", completed: true },
    ],
  },
  {
    title: "Asymptotic Analysis",
    items: [
      { text: "Introduction to Asymptotic notation", completed: true },
      { text: "Big-Θ (Big-Theta) notation", completed: true },
      { text: "Functions in Asymptotic Notation", completed: true },
      { text: "Big-O notation", completed: true },
      { text: "Big-Ω (Big-Omega) notation", completed: false },
      { text: "Quiz: Asymptotic notation", completed: true },
    ],
  },
  {
    title: "Selection Sort",
    items: [{ text: "Sorting", completed: false }],
  },
];

const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<boolean[]>(
    sidebarData.map(() => true),
  );

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded)),
    );
  };

  return (
    <div className="w-64 bg-white shadow-md p-2 overflow-y-auto">
      {sidebarData.map((section, index) => (
        <div key={index} className="mt-4">
          <div className="flex items-center justify-between py-1">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <button
              className="focus:outline-none text-sm"
              onClick={() => toggleSection(index)}
            >
              {expandedSections[index] ? "-" : "+"}
            </button>
          </div>
          {expandedSections[index] && (
            <ul>
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-center py-1 text-sm">
                  <span
                    className={`w-3 h-3 rounded-full mr-2 ${
                      item.completed
                        ? "bg-green-500"
                        : "bg-white border-2 border-black"
                    }`}
                  ></span>
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
