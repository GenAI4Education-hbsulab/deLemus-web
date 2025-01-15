import JN1Overview from "@/components/content/jn1overview";
import Head from "next/head";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <Head>
        <title>KP2 Overview</title>
      </Head>
      <JN1Overview />
    </div>
  );
};

export default Home;
