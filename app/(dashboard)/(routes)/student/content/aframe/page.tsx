// pages/index.tsx
import BabylonScene from "@/components/content/BabylonScene";
import Head from "next/head";

// Dynamically import BabylonScene to ensure it only runs on the client-side

export default function Home() {
  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <Head>
        <title>Babylon.js with Next.js</title>
        <meta name="description" content="Babylon.js with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BabylonScene />
    </div>
  );
}
