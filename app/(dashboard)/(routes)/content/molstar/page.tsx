// pages/index.js
"use client";
import Head from "next/head";
import MolstarViewer from "../../../../../components/content/MolstarViewer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Molstar Viewer in Next.js</title>
        <meta
          name="description"
          content="Integrating Molstar Viewer in a Next.js project"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Molstar Viewer in Next.js</h1>
        <MolstarViewer />
      </main>
    </div>
  );
}
