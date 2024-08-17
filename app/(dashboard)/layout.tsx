"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import Footer from "./_components/footer";
import NewNavBar from "./_components/newNavbar";
import NewSideBar from "./_components/newSidebar";
import Logo from "./_components/newLogo";
import { Button } from "@/components/button";
import { Search } from "lucide-react";

const LandingPageLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <header className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="logo">
            <Logo />
          </div>
          <nav className="hidden md:flex space-x-4">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-700">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700">
                  Teaching
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow mx-4 relative hidden md:block">
          <div className="search-bar flex items-center relative">
            <Search className="h-5 w-5 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses"
              className="p-2 pl-10 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Log In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
      <div className="container mx-auto md:hidden flex justify-between items-center mt-4">
        <div className="flex-grow mx-4 relative">
          <div className="search-bar flex items-center relative">
            <Search className="h-5 w-5 absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses"
              className="p-2 pl-10 border border-gray-300 rounded w-full"
            />
          </div>
        </div>
      </div>
    </header>
    <main>{children}</main>
    <Footer />
  </div>
);

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <div className="fixed w-full z-50">
      <NewNavBar />
    </div>
    <div className="flex flex-1 pt-[60px]">
      <div className="hidden md:flex w-56 fixed h-full z-40">
        <NewSideBar />
      </div>
      <main className="flex-1 md:ml-56 p-4">{children}</main>
    </div>
    <div className="md:ml-56">
      <Footer />
    </div>
  </div>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return pathname.startsWith("/student") || pathname.startsWith("/teacher") ? (
    <DashboardLayout {...{ children }} />
  ) : (
    <LandingPageLayout {...{ children }} />
  );
};

export default Layout;
