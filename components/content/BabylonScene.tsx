"use client";
import React, { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  SceneLoader,
  Color3,
  StandardMaterial,
  Color4,
  HighlightLayer,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import "@babylonjs/materials";
import "@babylonjs/serializers";
import "@babylonjs/inspector"; // Optional, for debugging

const BabylonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalPositions = useRef<Map<string, Vector3>>(new Map());

  useEffect(() => {
    const initializeBabylon = async () => {
      if (!canvasRef.current) return;

      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      // Set the clear color to white
      scene.clearColor = new Color4(1, 1, 1, 1);

      // Create a camera
      const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 50, Vector3.Zero(), scene);
      camera.attachControl(canvasRef.current, true);

      // Create a hemispheric light
      const hemisphericLight = new HemisphericLight("hemilight", new Vector3(0, 1, 0), scene);
      hemisphericLight.intensity = 0.6;

      // Create ground with a white material
      const ground = Mesh.CreateGround("ground", 500, 500, 10, scene);
      const groundMaterial = new StandardMaterial("groundMat", scene);
      groundMaterial.diffuseColor = new Color3(1, 1, 1); // White color
      ground.material = groundMaterial;

      // Load the model and store original positions
      const loadModel = async () => {
        const result = await SceneLoader.ImportMeshAsync("", "/", "1mbn.gltf", scene);
        result.meshes.forEach(mesh => {
          originalPositions.current.set(mesh.name, mesh.position.clone());
        });
        return result.meshes[0] as Mesh;
      };

      const modelMesh = await loadModel();
      modelMesh.position.y = 20;

      // Highlight layer
      const highlightLayer = new HighlightLayer("hl1", scene);

      // XR experience
      const xrHelper = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [ground],
      });

      xrHelper.input.onControllerAddedObservable.add((controller) => {
        controller.onMotionControllerInitObservable.add((motionController) => {
          const triggerComponent = motionController.getComponent("xr-standard-trigger");
          const resetButtonComponent = motionController.getComponent("xr-standard-squeeze");

          // Handle trigger for grabbing and highlighting
          triggerComponent.onButtonStateChangedObservable.add(() => {
            if (!triggerComponent.changes.pressed) return;

            const meshUnderPointer = xrHelper.pointerSelection.getMeshUnderPointer?.(controller.uniqueId) || scene.meshUnderPointer;
            if (meshUnderPointer && meshUnderPointer !== ground && meshUnderPointer instanceof Mesh) {
              if (triggerComponent.pressed) {
                meshUnderPointer.setParent(motionController.rootMesh);
                highlightLayer.addMesh(meshUnderPointer, Color3.Yellow());
              } else {
                meshUnderPointer.setParent(null);
                highlightLayer.removeMesh(meshUnderPointer);
              }
            }
          });

          // Handle reset button to reset positions
          resetButtonComponent.onButtonStateChangedObservable.add(() => {
            if (resetButtonComponent.changes.pressed && resetButtonComponent.pressed) {
              originalPositions.current.forEach((position, name) => {
                const part = scene.getMeshByName(name);
                if (part) part.position = position.clone();
              });
            }
          });
        });
      });

      // Render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      // Handle resize
      window.addEventListener("resize", () => {
        engine.resize();
      });

      return () => {
        engine.dispose();
      };
    };

    initializeBabylon();
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default BabylonCanvas;
