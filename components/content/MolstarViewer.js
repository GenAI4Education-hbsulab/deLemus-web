"use client";
import React, { useEffect } from "react";

const MolstarViewer = () => {
  useEffect(() => {
    // Load polyfills and Molstar scripts
    const polyfillScript = document.createElement("script");
    polyfillScript.src =
      "https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js";
    document.head.appendChild(polyfillScript);

    const webComponentsLite = document.createElement("script");
    webComponentsLite.src =
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js";
    document.head.appendChild(webComponentsLite);

    const customElementsEs5Adapter = document.createElement("script");
    customElementsEs5Adapter.src =
      "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js";
    document.head.appendChild(customElementsEs5Adapter);

    const molstarScript = document.createElement("script");
    molstarScript.src =
      "https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar-component.js";
    document.head.appendChild(molstarScript);
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar.css"
      />
      <div
        id="myViewer"
        style={{
          width: "700px",
          height: "526px",
          position: "relative",
          margin: "20px",
          backgroundColor: "white",
        }}
      >
        <pdbe-molstar
          id="pdbeMolstarComponent"
          molecule-id="1hda"
          assembly-id="1"
          default-preset="default"
          alphafold-view="false"
          hide-water="true"
          hide-het="false"
          hide-non-standard="false"
          load-maps="false"
          bg-color-b="255"
          bg-color-r="255"
          bg-color-g="255"
          highlight-color-g="255"
          highlight-color-b="0"
          select-color-g="255"
          select-color-b="0"
          lighting="glossy"
          domain-annotation="true"
          validation-annotation="true"
          symmetry-annotation="true"
          pdbe-url="https://www.ebi.ac.uk/pdbe/"
          encoding="bcif"
          low-precision="true"
          subscribe-events="false"
          hide-controls="true"
          sequence-panel="false"
          pdbe-link="true"
          loading-overlay="true"
          expanded="false"
          landscape="false"
          reactive="false"
        />
      </div>
    </>
  );
};

export default MolstarViewer;
