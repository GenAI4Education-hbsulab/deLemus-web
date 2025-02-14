// pages/index.tsx
import AvatarScene from "@/components/content/avatarScene";
import Head from "next/head";

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
      <AvatarScene />
    </div>
  );
}
