"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
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
  TransformNode,
  WebXRDefaultExperience,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import "@babylonjs/materials";
import "@babylonjs/serializers";
import "@babylonjs/inspector"; // Optional, for debugging

const MolecularView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [xrExperience, setXRExperience] =
    useState<WebXRDefaultExperience | null>(null);

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
        const createScene = async () => {
          try {
            const result = await SceneLoader.ImportMeshAsync(
              "",
              "/",
              "5KB2.glb",
              scene,
            );

            console.log("Loaded meshes:", result.meshes);

            if (!result.meshes || result.meshes.length === 0) {
              console.error("No meshes were loaded from the model");
              return;
            }

            // Create a TransformNode to act as the parent for all meshes
            const modelRoot = new TransformNode("modelRoot", scene);

            // Parent all loaded meshes to the TransformNode
            result.meshes.forEach((mesh) => {
              mesh.parent = modelRoot;
            });

            // Position the entire model
            modelRoot.position.y = 20; // Position the model above the ground

            // Make the model pickable
            modelRoot.getChildMeshes().forEach((mesh) => {
              mesh.isPickable = true;
            });

            console.log("Model root position:", modelRoot.position);

            // Highlight layer
            const highlightLayer = new HighlightLayer("hl1", scene);

            const xrHelper = await scene.createDefaultXRExperienceAsync({
              floorMeshes: [ground],
            });

            setXRExperience(xrHelper);
            setIsVRSupported(
              await xrHelper.baseExperience.sessionManager.isSessionSupportedAsync(
                "immersive-vr",
              ),
            );

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
                    });
                  }
                },
              );
            });
          } catch (error) {
            console.error("Error loading or processing the model:", error);
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

  const enterVR = async () => {
    if (xrExperience) {
      try {
        await xrExperience.baseExperience.enterXRAsync(
          "immersive-vr",
          "local-floor",
        );
      } catch (error) {
        console.error("Error entering VR:", error);
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      {isVRSupported && (
        <button
          onClick={enterVR}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          Enter VR
        </button>
      )}
    </div>
  );
};

export default MolecularView;
