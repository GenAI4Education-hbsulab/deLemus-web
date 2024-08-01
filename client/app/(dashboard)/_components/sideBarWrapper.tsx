// pages/index.tsx
import Head from "next/head";
import CourseSideBar from "./courseSideBar";

const hrefs = [
  { href: "/content", text: "Back" },
  { href: "/content/kp2", text: "Next" },
] as const;

const SideBarWrapper: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Sidebar Example</title>
      </Head>
      <CourseSideBar />
    </div>
  );
};

export default SideBarWrapper;
