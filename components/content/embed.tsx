import dynamic from "next/dynamic";
import { Suspense } from "react";

const TransformerEmbed = dynamic(() => import("./transformer"), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>,
});

const YourPage = () => {
  return (
    <div>
      <h1>Your Page Title</h1>
      <Suspense fallback={<div>Loading 3D scene...</div>}>
        <TransformerEmbed />
      </Suspense>
    </div>
  );
};

export default YourPage;
