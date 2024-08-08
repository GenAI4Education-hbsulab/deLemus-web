"use client";
import React, { useEffect, useRef, useCallback } from "react";
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
  Color4,
  HighlightLayer,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import "@babylonjs/materials";
import "@babylonjs/serializers";
import "@babylonjs/inspector"; // Optional, for debugging

const MolecularView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  useEffect(() => {
    const initializeBabylon = async () => {
      if (canvasRef.current) {
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        // Set the clear color to white
        scene.clearColor = new Color4(1, 1, 1, 1);

        // Create a camera
        const camera = new ArcRotateCamera(
          "Camera",
          Math.PI / 2,
          Math.PI / 2.5,
          50,
          Vector3.Zero(),
          scene,
        );
        camera.attachControl(canvasRef.current, true);

        // Create a hemispheric light
        const hemisphericLight = new HemisphericLight(
          "hemilight",
          new Vector3(0, 1, 0),
          scene,
        );
        hemisphericLight.intensity = 0.6;

        // Create a point light
        const pointLight = new PointLight(
          "pointLight",
          new Vector3(0, 50, -50),
          scene,
        );
        pointLight.intensity = 0.6;

        // Create ground with a white material
        const ground = Mesh.CreateGround("ground", 500, 500, 10, scene);
        const groundMaterial = new StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new Color3(1, 1, 1); // White color
        ground.material = groundMaterial;

        // Load the model
        let modelMesh: Mesh;
        const createScene = async () => {
          const result = await SceneLoader.ImportMeshAsync(
            "",
            "/",
            "1mbn.gltf",
            scene,
          );
          modelMesh = result.meshes[0] as Mesh;
          modelMesh.position.y = 20; // Position the model above the ground

          // Highlight layer
          const highlightLayer = new HighlightLayer("hl1", scene);

          const xrHelper = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [ground],
          });

          let mesh: Mesh | null = null;

          xrHelper.input.onControllerAddedObservable.add((controller) => {
            controller.onMotionControllerInitObservable.add(
              (motionController) => {
                if (
                  motionController.handness === "left" ||
                  motionController.handness === "right"
                ) {
                  const xr_ids = motionController.getComponentIds();
                  let triggerComponent = motionController.getComponent(
                    xr_ids[0],
                  );
                  triggerComponent.onButtonStateChangedObservable.add(() => {
                    if (triggerComponent.changes.pressed) {
                      if (triggerComponent.pressed) {
                        if (xrHelper.pointerSelection.getMeshUnderPointer) {
                          mesh = xrHelper.pointerSelection.getMeshUnderPointer(
                            controller.uniqueId,
                          ) as Mesh;
                        } else {
                          mesh = scene.meshUnderPointer as Mesh;
                        }
                        if (mesh && mesh !== ground) {
                          mesh.setParent(motionController.rootMesh);
                          // Highlight the model when picked up
                          highlightLayer.addMesh(mesh, Color3.Yellow());
                        }
                      } else if (mesh) {
                        mesh.setParent(null);
                        // Remove highlight when released
                        highlightLayer.removeMesh(mesh);
                      }
                    }
                  });
                }
              },
            );
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
    };

    initializeBabylon();
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MolecularView;
