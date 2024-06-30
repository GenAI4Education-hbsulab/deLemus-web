import Quiz from "@/components/content/modi_quiz";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Quiz App</title>
      </Head>
      <main className="flex items-center justify-center">
        <Quiz />
      </main>
    </div>
  );
}
