"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders"; // Ensure the loaders are included
import "@babylonjs/inspector"; // Optional, for debugging

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const modelRef = useRef<BABYLON.AbstractMesh | null>(null);
  const xrRef = useRef<BABYLON.WebXRDefaultExperience | null>(null);

  useEffect(() => {
    const initializeScene = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const engine = new BABYLON.Engine(canvas, true);

      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2,
        10,
        new BABYLON.Vector3(0, 2, 0),
        scene,
      );
      camera.attachControl(canvas, true);
      camera.wheelDeltaPercentage = 0.01;

      new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene).intensity = 0.8;

      scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

      BABYLON.DracoCompression.Configuration = {
        decoder: {
          wasmUrl: "https://cdn.jsdelivr.net/npm/draco3dgltf@1.4.1/draco_decoder.wasm",
          wasmBinaryUrl: "https://cdn.jsdelivr.net/npm/draco3dgltf@1.4.1/draco_decoder.wasm.bin",
          fallbackUrl: "https://cdn.jsdelivr.net/npm/draco3dgltf@1.4.1/draco_decoder.js",
        },
      };

      new BABYLON.SceneOptimizer(scene).start();

      const xr = await BABYLON.WebXRDefaultExperience.CreateAsync(scene);
      xrRef.current = xr;
      addControllerInteractions(xr);

      xr.baseExperience.onStateChangedObservable.add((state) => {
        setIsInVR(state === BABYLON.WebXRState.ENTERING_XR);
      });

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", handleResize);

      function handleResize() {
        engine.resize();
      }

      return () => {
        window.removeEventListener("resize", handleResize);
        engine.dispose();
        scene.dispose();
      };
    };

    const addControllerInteractions = (xr: BABYLON.WebXRDefaultExperience) => {
      xr.input.onControllerAddedObservable.add((inputSource) => {
        if (inputSource.motionController) {
          addThumbstickComponentInteraction(inputSource);
        }
      });
    };

    const addThumbstickComponentInteraction = (inputSource: BABYLON.WebXRInputSource) => {
      const thumbstickComponent = inputSource.motionController?.getComponent("xr-standard-thumbstick");
      if (thumbstickComponent) {
        thumbstickComponent.onAxisValueChangedObservable.add((values) => {
          if (modelRef.current) {
            modelRef.current.rotation.y += values.x * 0.1;

            const forward = new BABYLON.Vector3(
              Math.sin(modelRef.current.rotation.y),
              0,
              Math.cos(modelRef.current.rotation.y)
            ).normalize();

            modelRef.current.position.addInPlace(forward.scale(values.y * 0.1));
          }
        });
      }
    };

    initializeScene();
  }, []);

  const loadModel = useCallback(() => {
    const scene = BABYLON.EngineStore.LastCreatedScene;
    if (!scene) return;

    if (isModelLoaded) {
      modelRef.current?.dispose();
      modelRef.current = null;
      setIsModelLoaded(false);
      return;
    }

    const assetsManager = new BABYLON.AssetsManager(scene);
    const glbTask = assetsManager.addMeshTask("glbTask", "", "/", "1mbn.gltf");

    glbTask.onSuccess = (task) => {
      task.loadedMeshes.forEach((mesh) => {
        mesh.position = new BABYLON.Vector3(0, 0, 0);
        modelRef.current = mesh;
      });
      setIsModelLoaded(true);
    };

    glbTask.onError = (task, message, exception) => {
      console.error("Error loading GLB model", message, exception);
    };

    assetsManager.load();
  }, [isModelLoaded]);

  const exitVR = useCallback(() => {
    xrRef.current?.baseExperience.exitXRAsync();
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <button
        onClick={loadModel}
        className={`absolute top-2 left-2 z-10 p-4 text-xl font-semibold text-white rounded ${isModelLoaded ? "bg-red-500" : "bg-blue-500"}`}
      >
        {isModelLoaded ? "Unload Model" : "Load Model"}
      </button>
      {isInVR && (
        <button
          onClick={exitVR}
          className="absolute top-2 right-2 z-10 p-4 text-2xl font-bold text-white bg-green-500 rounded"
        >
          Exit VR
        </button>
      )}
    </div>
  );
};

export default BabylonScene;
