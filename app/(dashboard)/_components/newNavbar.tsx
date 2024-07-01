"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Search, ShoppingCart, Heart, Bell, Menu } from "lucide-react";
import { Button } from "@/components/button"; // Ensure the path is correct for your Button component

const NewNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm relative">
      <div className="flex items-center px-4">
        <Link href={{ pathname: "/" }}>
          <span className="text-xl font-semibold">EduPlatform</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Link href={{ pathname: "/pricing" }}>
          <span className="text-gray-700 hover:text-blue-500">Pricing</span>
        </Link>
        <Link href={{ pathname: "/resources" }}>
          <span className="text-gray-700 hover:text-blue-500">Resources</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4 ml-auto">
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

      <div className="flex md:hidden items-center ml-auto">
        <button onClick={toggleMenu}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md z-10 md:hidden">
          <div className="flex flex-col items-start p-4 space-y-2">
            <Link
              href={{ pathname: "/pricing" }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-700 hover:text-blue-500">Pricing</span>
            </Link>
            <Link
              href={{ pathname: "/business" }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-700 hover:text-blue-500">
                For Business
              </span>
            </Link>
            <Link
              href={{ pathname: "/resources" }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-700 hover:text-blue-500">
                Resources
              </span>
            </Link>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search courses"
                className="border rounded-full py-1 px-2 text-sm w-full"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search />
              </button>
            </div>
            {isTeacherPage || isPlayerPage ? (
              <Link href={{ pathname: "/" }} onClick={() => setMenuOpen(false)}>
                <Button size="sm" variant="ghost" className="w-full text-left">
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </Link>
            ) : null}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NewNavBar;
