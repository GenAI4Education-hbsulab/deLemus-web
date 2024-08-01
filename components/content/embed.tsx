import React from "react";
import TransformerEmbed from "./transformer";

const SketchfabEmbed: React.FC = () => {
  const embedCode = `
    <div class="sketchfab-embed-wrapper" style="width: 100%; height: 600px;">
      <iframe title="Fully Connected Neural Network Visualization" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/6f36938d754746d9831e755f0e0460fd/embed" style="width: 100%; height: 100%;"> </iframe>
      <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
        <a href="https://sketchfab.com/3d-models/fully-connected-neural-network-visualization-6f36938d754746d9831e755f0e0460fd?utm_medium=embed&utm_campaign=share-popup&utm_content=6f36938d754746d9831e755f0e0460fd" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> Fully Connected Neural Network Visualization </a> by <a href="https://sketchfab.com/atdigit?utm_medium=embed&utm_campaign=share-popup&utm_content=6f36938d754746d9831e755f0e0460fd" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;"> atdigit </a> on <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=6f36938d754746d9831e755f0e0460fd" target="_blank" rel="nofollow" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a>
      </p>
    </div>
  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: embedCode }} />
      <TransformerEmbed />
    </>
  );
};

export default SketchfabEmbed;
