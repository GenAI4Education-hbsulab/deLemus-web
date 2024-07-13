"use client";
import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders"; // Ensure the loaders are included
import "@babylonjs/inspector"; // Optional, for debugging

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const xrRef = useRef<BABYLON.WebXRDefaultExperience | null>(null);
  const modelRef = useRef<BABYLON.AbstractMesh | null>(null);
  const highlightLayerRef = useRef<BABYLON.HighlightLayer | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const initializeScene = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const engine = new BABYLON.Engine(canvas, true);
      engineRef.current = engine;

      const scene = new BABYLON.Scene(engine);
      sceneRef.current = scene;

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

      const light1 = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(1, 1, 0),
        scene,
      );
      light1.intensity = 0.8;

      scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

      BABYLON.DracoCompression.Configuration = {
        decoder: {
          wasmUrl:
            "https://cdn.jsdelivr.net/npm/draco3dgltf@1.4.1/draco_decoder.wasm",
          wasmBinaryUrl:
            "https://cdn.jsdelivr.net/npm/draco3dgltf@1.4.1/draco_decoder.wasm.bin",
          fallbackUrl:
            "https://cdn.jsdelivr.net/npm/draco3dgltf@1.4.1/draco_decoder.js",
        },
      };

      const optimizer = new BABYLON.SceneOptimizer(scene);
      optimizer.start();

      const xr = await BABYLON.WebXRDefaultExperience.CreateAsync(scene);
      xrRef.current = xr;

      highlightLayerRef.current = new BABYLON.HighlightLayer(
        "highlightLayer",
        scene,
      );

      xr.input.onControllerAddedObservable.add((inputSource) => {
        inputSource.onMotionControllerInitObservable.add((motionController) => {
          const triggerComponent = motionController.getComponent(
            "xr-standard-trigger",
          );
          if (triggerComponent) {
            triggerComponent.onButtonStateChangedObservable.add((component) => {
              if (component.pressed) {
                const forwardRay = new BABYLON.Ray(
                  BABYLON.Vector3.Zero(),
                  BABYLON.Vector3.Forward(),
                );
                inputSource.getWorldPointerRayToRef(forwardRay);

                const pickInfo = scene.pickWithRay(forwardRay);
                if (pickInfo?.hit && pickInfo.pickedMesh) {
                  highlightLayerRef.current?.addMesh(
                    pickInfo.pickedMesh as BABYLON.Mesh,
                    BABYLON.Color3.Red(),
                  );
                }
              } else {
                highlightLayerRef.current?.removeAllMeshes();
              }
            });
          }

          const squeezeComponent = motionController.getComponent(
            "xr-standard-squeeze",
          );
          if (squeezeComponent) {
            squeezeComponent.onButtonStateChangedObservable.add((component) => {
              if (modelRef.current) {
                const scaleChange = 0.02;
                const minScale = 0.1;
                const maxScale = 5.0;

                if (component.pressed) {
                  modelRef.current.scaling.addInPlace(
                    new BABYLON.Vector3(scaleChange, scaleChange, scaleChange),
                  );
                } else {
                  modelRef.current.scaling.subtractInPlace(
                    new BABYLON.Vector3(scaleChange, scaleChange, scaleChange),
                  );
                }

                modelRef.current.scaling.x = BABYLON.Scalar.Clamp(
                  modelRef.current.scaling.x,
                  minScale,
                  maxScale,
                );
                modelRef.current.scaling.y = BABYLON.Scalar.Clamp(
                  modelRef.current.scaling.y,
                  minScale,
                  maxScale,
                );
                modelRef.current.scaling.z = BABYLON.Scalar.Clamp(
                  modelRef.current.scaling.z,
                  minScale,
                  maxScale,
                );
              }
            });
          }

          const thumbstickComponent = motionController.getComponent(
            "xr-standard-thumbstick",
          );
          if (thumbstickComponent) {
            thumbstickComponent.onAxisValueChangedObservable.add((values) => {
              if (modelRef.current) {
                modelRef.current.position.x += values.x * 0.1;
                modelRef.current.rotation.y += values.x * 0.1;
                modelRef.current.position.z += values.y * 0.1;
              }
            });
          }
        });
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
        if (engineRef.current) {
          engineRef.current.dispose();
        }
        if (sceneRef.current) {
          sceneRef.current.dispose();
        }
        xrRef.current = null;
      };
    };

    initializeScene();
  }, []);

  const loadModel = () => {
    if (isModelLoaded) {
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
      setIsModelLoaded(false);
      return;
    }

    const scene = sceneRef.current;
    if (!scene) return;

    const assetsManager = new BABYLON.AssetsManager(scene);
    const glbTask = assetsManager.addMeshTask("glbTask", "", "/", "model.glb");

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
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <button
        onClick={loadModel}
        className={`absolute top-2 left-2 z-10 p-2 text-lg font-semibold text-white rounded ${isModelLoaded ? "bg-red-500" : "bg-blue-500"}`}
      >
        {isModelLoaded ? "Unload Model" : "Load Model"}
      </button>
    </div>
  );
};

export default BabylonScene;
