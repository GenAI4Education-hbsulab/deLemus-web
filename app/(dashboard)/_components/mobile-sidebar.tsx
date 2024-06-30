import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/sheet";

import NewSideBar from "./newSidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <NewSideBar />
      </SheetContent>
    </Sheet>
  );
};
