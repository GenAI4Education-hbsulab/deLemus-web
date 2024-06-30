import React from "react";
import Footer from "./_components/footer";
import NewNavBar from "./_components/newNavbar";
import NewSideBar from "./_components/newSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
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
};

export default DashboardLayout;
