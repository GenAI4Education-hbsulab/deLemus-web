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
  WebXRDefaultExperience,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import "@babylonjs/materials";
import "@babylonjs/serializers";
import "@babylonjs/inspector"; // Optional, for debugging
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

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
          100,
          new Vector3(0, 0, 0),
          scene,
        );
        camera.setPosition(new Vector3(50, 50, 50));
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvasRef.current, true);

        // Create a hemispheric light
        const hemisphericLight = new HemisphericLight(
          "hemilight",
          new Vector3(0, 1, 0),
          scene,
        );
        hemisphericLight.intensity = 0.6;

        // Create a point light
        // const pointLight = new PointLight("pointLight", new Vector3(0, 50, -50), scene);
        // pointLight.intensity = 0.6;

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
          modelMesh.position.y = 17; // Position the model above the ground

          // Highlight layer
          const highlightLayer = new HighlightLayer("hl1", scene);

          try {
            // Hide the default VR button
            const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
              disableDefaultUI: true,
              floorMeshes: [ground],
            });

            // Create custom Enter VR button
            const advancedTexture =
              AdvancedDynamicTexture.CreateFullscreenUI("UI");
            const enterVRButton = Button.CreateSimpleButton(
              "enterVRButton",
              "Enter VR",
            );
            enterVRButton.width = "150px";
            enterVRButton.height = "40px";
            enterVRButton.color = "white";
            enterVRButton.cornerRadius = 20;
            enterVRButton.background = "green";
            enterVRButton.onPointerUpObservable.add(() => {
              xrHelper.baseExperience.enterXRAsync(
                "immersive-vr",
                "local-floor",
              );
            });
            advancedTexture.addControl(enterVRButton);

            // Position the button
            enterVRButton.horizontalAlignment =
              Button.HORIZONTAL_ALIGNMENT_RIGHT;
            enterVRButton.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
            enterVRButton.left = "-20px";
            enterVRButton.top = "-20px";

            // Check if WebXR is available
            if (!xrHelper.baseExperience) {
              console.log("WebXR not available on this device");
              enterVRButton.isEnabled = false;
              enterVRButton.background = "grey";
            }

            if (xrHelper.baseExperience) {
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
                      triggerComponent.onButtonStateChangedObservable.add(
                        () => {
                          if (triggerComponent.changes.pressed) {
                            if (triggerComponent.pressed) {
                              if (
                                xrHelper.pointerSelection.getMeshUnderPointer
                              ) {
                                mesh =
                                  xrHelper.pointerSelection.getMeshUnderPointer(
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
                        },
                      );
                    }
                  },
                );
              });
            } else {
              console.log("WebXR not available on this device");
            }
          } catch (error) {
            console.error("Error initializing WebXR:", error);
          }
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

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default MolecularView;
