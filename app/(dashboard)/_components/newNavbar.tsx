"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Search, ShoppingCart, Heart, Bell } from "lucide-react";
import { Button } from "@/components/button"; // Ensure the path is correct for your Button component

const NewNavBar = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href={{ pathname: "/" }}>
          <span className="text-xl font-semibold">EduPlatform</span>
        </Link>
        <Link href={{ pathname: "/pricing" }}>
          <span className="text-gray-700 hover:text-blue-500">Pricing</span>
        </Link>
        <Link href={{ pathname: "/business" }}>
          <span className="text-gray-700 hover:text-blue-500">
            For Business
          </span>
        </Link>
        <Link href={{ pathname: "/resources" }}>
          <span className="text-gray-700 hover:text-blue-500">Resources</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4 ml-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses"
            className="border rounded-full py-1 px-2 text-sm"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {isTeacherPage || isPlayerPage ? (
            <Link href={{ pathname: "/" }}>
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </Link>
          ) : (
            <>
              <Link href={{ pathname: "/favorites" }}>
                <Heart className="w-6 h-6 text-gray-700 hover:text-blue-500" />
              </Link>
              <Link href={{ pathname: "/cart" }}>
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-500" />
              </Link>
              <Link href={{ pathname: "/notifications" }}>
                <Bell className="w-6 h-6 text-gray-700 hover:text-blue-500" />
              </Link>
              <Link href={{ pathname: "/teacher/courses" }}>
                <Button size="sm" variant="ghost">
                  Teacher mode
                </Button>
              </Link>
            </>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};

export default NewNavBar;
