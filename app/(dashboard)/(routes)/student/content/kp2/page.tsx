import KP2Overview from "@/components/content/kp2overview";
import Head from "next/head";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <Head>
        <title>KP2 Overview</title>
      </Head>
      <KP2Overview />
    </div>
  );
};

export default Home;
