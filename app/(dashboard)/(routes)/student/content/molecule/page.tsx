// pages/index.tsx
import MolecularView from "@/components/content/MolecularView";
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
      <MolecularView />
    </div>
  );
}
