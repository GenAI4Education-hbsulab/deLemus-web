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
  {
    icon: User,
    label: "Profile",
    href: { pathname: "/student/profile" },
  },
  {
    icon: Clipboard,
    label: "Assignments",
    href: { pathname: "/student/assignments" },
  },
  {
    icon: Bell,
    label: "Notifications",
    href: { pathname: "/student/notifications" },
  },
  {
    icon: Settings,
    label: "Settings",
    href: { pathname: "/student/settings" },
  },
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
    title: "Chapter 1",
    items: [
      {
        text: "General Info",
        completed: true,
        href: { pathname: "/student/content" },
      },
      {
        text: "KP.2",
        completed: false,
        href: { pathname: "/student/content/kp2" },
      },
      {
        text: "JN.1",
        completed: false,
        href: { pathname: "/student/content/jn1" },
      },
      {
        text: "Quiz",
        completed: false,
        href: { pathname: "/student/content/quiz" },
      },
    ],
  },
  {
    title: "Chapter 2",
    items: [
      {
        text: "Introduction to Asymptotic notation",
        completed: false,
        href: {
          pathname:
            "/student/content/chapter2/introduction-asymptotic-notation",
        },
      },
      {
        text: "Big-Θ (Big-Theta) notation",
        completed: false,
        href: { pathname: "/student/content/chapter2/big-theta-notation" },
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
      <div className="flex flex-col w-full overflow-y-auto">
        {routes.map((route, i) => (
          <>
            <SidebarItem
              key={i}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
            {route.label === "Content" &&
              !isTeacherPage &&
              pathname.startsWith("/student/content") && (
                <>
                  {sidebarData.map((section, index) => (
                    <div key={index} className="px-4">
                      <div className="flex items-center justify-between py-2">
                        <h2 className="text-lg font-semibold">
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
          </>
        ))}
      </div>
    </div>
  );
};

export default NewSideBar;
