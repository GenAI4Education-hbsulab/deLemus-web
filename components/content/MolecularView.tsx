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
  TransformNode,
  AbstractMesh,
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

        scene.clearColor = new Color4(1, 1, 1, 1);

        const camera = new ArcRotateCamera(
          "Camera",
          Math.PI / 2,
          Math.PI / 2.5,
          50,
          Vector3.Zero(),
          scene,
        );
        camera.attachControl(canvasRef.current, true);

        const hemisphericLight = new HemisphericLight(
          "hemilight",
          new Vector3(0, 1, 0),
          scene,
        );
        hemisphericLight.intensity = 0.6;

        const pointLight = new PointLight(
          "pointLight",
          new Vector3(0, 50, -50),
          scene,
        );
        pointLight.intensity = 0.6;

        const ground = Mesh.CreateGround("ground", 500, 500, 10, scene);
        const groundMaterial = new StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new Color3(1, 1, 1);
        ground.material = groundMaterial;

        const createScene = async () => {
          try {
            const result = await SceneLoader.ImportMeshAsync(
              "",
              "/",
              "1MBN.glb",
              scene,
            );

            // Create a parent TransformNode for the entire model
            const modelRoot = new TransformNode("modelRoot", scene);
            modelRoot.position.y = 20; // Position the model above the ground

            // Parent all imported meshes to the modelRoot
            result.meshes.forEach((mesh) => {
              mesh.parent = modelRoot;
            });

            // Make all meshes pickable
            modelRoot.getChildMeshes().forEach((mesh) => {
              mesh.isPickable = true;
            });

            const highlightLayer = new HighlightLayer("hl1", scene);

            const xrHelper = await scene.createDefaultXRExperienceAsync({
              floorMeshes: [ground],
            });

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
                          const pickedMesh = xrHelper.pointerSelection
                            .getMeshUnderPointer
                            ? xrHelper.pointerSelection.getMeshUnderPointer(
                                controller.uniqueId,
                              )
                            : scene.meshUnderPointer;

                          if (pickedMesh && pickedMesh !== ground) {
                            // Move the entire modelRoot instead of individual meshes
                            modelRoot.setParent(motionController.rootMesh);
                            modelRoot.getChildMeshes().forEach((mesh) => {
                              highlightLayer.addMesh(
                                mesh as Mesh,
                                Color3.Yellow(),
                              );
                            });
                          }
                        } else {
                          // Release the model
                          modelRoot.setParent(null);
                          modelRoot.getChildMeshes().forEach((mesh) => {
                            highlightLayer.removeMesh(mesh as Mesh);
                          });
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

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MolecularView;
