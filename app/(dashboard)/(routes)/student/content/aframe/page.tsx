// pages/index.tsx
import BabylonScene from "@/components/content/BabylonScene";
import Head from "next/head";

export default function Home() {
    const models = ["1mbn.gltf"]; // This could be fetched from a server
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
            <BabylonScene {...{ models }} />
        </div>
    );
}
