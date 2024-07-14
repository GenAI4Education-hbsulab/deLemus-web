"use client";
import React, { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  PointLight,
  Mesh,
  SceneLoader,
  Color3,
  StandardMaterial,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import "@babylonjs/materials";
import "@babylonjs/serializers";
import "@babylonjs/inspector"; // Optional, for debugging

const BabylonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      // Set the clear color to white
      scene.clearColor = new Color3(1, 1, 1);

      // Create a camera
      const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 50, Vector3.Zero(), scene);
      camera.attachControl(canvasRef.current, true);

      // Create a hemispheric light
      const hemisphericLight = new HemisphericLight("hemilight", new Vector3(0, 1, 0), scene);
      hemisphericLight.intensity = 0.6;

      // Create a point light
      const pointLight = new PointLight("pointLight", new Vector3(0, 50, -50), scene);
      pointLight.intensity = 0.6;

      // Create ground with a white material
      const ground = Mesh.CreateGround("ground", 500, 500, 10, scene);
      const groundMaterial = new StandardMaterial("groundMat", scene);
      groundMaterial.diffuseColor = new Color3(1, 1, 1); // White color
      ground.material = groundMaterial;

      // Load the model
      let modelMesh: Mesh;
      const createScene = async () => {
        const result = await SceneLoader.ImportMeshAsync("", "/", "1mbn.gltf", scene);
        modelMesh = result.meshes[0] as Mesh;
        modelMesh.position.y = 30; // Position the model above the ground

        const xrHelper = await scene.createDefaultXRExperienceAsync({
          floorMeshes: [ground],
        });

        let mesh: Mesh | null = null;

        xrHelper.input.onControllerAddedObservable.add((controller) => {
          controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handness === "left") {
              const xr_ids = motionController.getComponentIds();
              let triggerComponent = motionController.getComponent(xr_ids[0]);
              triggerComponent.onButtonStateChangedObservable.add(() => {
                if (triggerComponent.changes.pressed) {
                  if (triggerComponent.pressed) {
                    mesh = scene.meshUnderPointer as Mesh;
                    console.log(mesh && mesh.name);
                    if (xrHelper.pointerSelection.getMeshUnderPointer) {
                      mesh = xrHelper.pointerSelection.getMeshUnderPointer(controller.uniqueId) as Mesh;
                    }
                    console.log(mesh && mesh.name);
                    if (mesh === ground) {
                      return;
                    }
                    mesh && mesh.setParent(motionController.rootMesh);
                  } else {
                    mesh && mesh.setParent(null);
                  }
                }
              });
            }
          });
        });
      };

      createScene();

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });

      return () => {
        engine.dispose();
      };
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default BabylonCanvas;
