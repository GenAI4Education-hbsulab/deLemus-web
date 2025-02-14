"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Layout,
  Compass,
  BarChart,
  List,
  Book,
  BookOpenText,
  User,
  Bell,
  Settings,
  Clipboard,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { UrlObject } from "url";
import NewLogo from "./newLogo";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: { pathname: "/student/dashboard" },
  },
  {
    icon: Book,
    label: "Search",
    href: { pathname: "/student/category" },
  },
  {
    icon: BookOpenText,
    label: "Content",
    href: { pathname: "/student/content" },
  },
  // {
  //   icon: User,
  //   label: "Profile",
  //   href: { pathname: "/student/profile" },
  // },
  // {
  //   icon: Clipboard,
  //   label: "Assignments",
  //   href: { pathname: "/student/assignments" },
  // },
  // {
  //   icon: Bell,
  //   label: "Notifications",
  //   href: { pathname: "/student/notifications" },
  // },
  // {
  //   icon: Settings,
  //   label: "Settings",
  //   href: { pathname: "/student/settings" },
  // },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: { pathname: "/teacher/courses" },
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: { pathname: "/teacher/analytics" },
  },
];

const sidebarData: {
  title: string;
  items: { text: string; completed: boolean; href: UrlObject }[];
}[] = [
  {
    title: "Computational Biology",
    items: [
      {
        text: "General Info",
        completed: true,
        href: { pathname: "/student/content" },
      },
      {
        text: "KP.2",
        completed: false,
        href: { pathname: "/student/content/comp-bio/kp2" },
      },
      {
        text: "JN.1",
        completed: false,
        href: { pathname: "/student/content/comp-bio/jn1" },
      },
      {
        text: "Biology Quiz",
        completed: false,
        href: { pathname: "/student/content/comp-bio/quiz" },
      },
      {
        text: "Molecular View",
        completed: false,
        href: { pathname: "/student/content/comp-bio/molecule" },
      },
      {
        text: "Molecular View (PDB)",
        completed: false,
        href: { pathname: "/student/content/comp-bio/pdb-covid" },
      },
      {
        text: "VR (Nanome)",
        completed: false,
        href: { pathname: "/student/content/comp-bio/nanome" },
      },
      {
        text: "Virtual Lab",
        completed: false,
        href: { pathname: "/student/content/comp-bio/virtual-lab" },
      },
    ],
  },
  {
    title: "Machine Learning",
    items: [
      {
        text: "LLM",
        completed: false,
        href: { pathname: "/student/content/machine-learn/gpt3" },
      },
      {
        text: "PCA",
        completed: false,
        href: { pathname: "/student/content/machine-learn/pca" },
      },
      {
        text: "Neural Networks",
        completed: false,
        href: { pathname: "/student/content/machine-learn/neural-net" },
      },
      {
        text: "Visualize Clustering",
        completed: false,
        href: { pathname: "/student/content/machine-learn/clustering" },
      },
      {
        text: "Train a Neural Network",
        completed: false,
        href: { pathname: "/student/content/machine-learn/train-neural-net" },
      },
      {
        text: "AI Quiz",
        completed: false,
        href: { pathname: "/student/content/machine-learn/ai-quiz" },
      },
      {
        text: "Transformer Model",
        completed: false,
        href: {
          pathname: "/student/content/machine-learn/transformer",
        },
      },
    ],
  },
  {
    title: "Probabilities & Statistics",
    items: [
      {
        text: "Probabilities & Statistics",
        completed: false,
        href: { pathname: "/student/content/prob-stat/siegrist" },
      },
    ],
  },
  {
    title: "Linear Algebra",
    items: [
      {
        text: "Linear Algebra",
        completed: false,
        href: { pathname: "/student/content/linear-algebra/linear-algebra" },
      },
    ],
  },
  {
    title: "GenAI Bot",
    items: [
      {
        text: "GenAI Bot",
        completed: false,
        href: {
          pathname: "/student/content/GenAI-bot/immersive",
        },
      },
    ],
  },
  
];

const NewSideBar: React.FC = () => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<boolean[]>(
    sidebarData.map(() => true),
  );

  const isTeacherPage = pathname?.startsWith("/teacher");

  const routes = [...(isTeacherPage ? teacherRoutes : guestRoutes)];

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded)),
    );
  };

  return (
    <div className="h-full border-r w-full flex flex-col overflow-auto shadow-sm bg-white">
      <div className="p-4 bg-white">
        <NewLogo />
      </div>
      <div
        className="flex flex-col w-full"
        style={{ height: "80vh", overflowY: "auto" }}
      >
        {routes.map((route, i) => (
          <React.Fragment key={route.label}>
            <SidebarItem
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
            {route.label === "Content" &&
              !isTeacherPage &&
              pathname.startsWith("/student/content") && (
                <>
                  {sidebarData.map((section, index) => (
                    <div key={index} className="px-2">
                      <div className="flex items-center justify-between py-2">
                        <h2 className="text-md font-semibold">
                          {section.title}
                        </h2>
                        <button
                          className="focus:outline-none text-xl"
                          onClick={() => toggleSection(index)}
                        >
                          {expandedSections[index] ? "-" : "+"}
                        </button>
                      </div>
                      {expandedSections[index] && (
                        <ul className="pl-4">
                          {section.items.map((item, idx) => (
                            <Link href={item.href} key={idx}>
                              <li
                                className={`flex items-center py-1 text-sm hover:bg-gray-200 rounded ${
                                  pathname === item.href.pathname
                                    ? "bg-gray-300"
                                    : "bg-transparent"
                                }`}
                              >
                                <span
                                  className={`w-3 h-3 rounded-full mr-2 ${
                                    pathname === item.href.pathname
                                      ? "bg-green-500"
                                      : "bg-white border-2 border-black"
                                  }`}
                                ></span>
                                <span className="hover:text-blue-500 cursor-pointer">
                                  {item.text}
                                </span>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </>
              )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NewSideBar;
