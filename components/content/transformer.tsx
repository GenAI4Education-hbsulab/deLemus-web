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
  Color4,
  WebXRState,
  HighlightLayer,
  PBRMaterial,
  ISceneLoaderProgressEvent,
  AbstractMesh,
  WebXRDefaultExperience,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import "@babylonjs/materials";
import "@babylonjs/serializers";
import "@babylonjs/inspector"; // Optional, for debugging
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui";

const TransformerEmbed: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

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
            "transformer.glb",
            scene,
            (event: ISceneLoaderProgressEvent) => {
              // Handle progress event if needed
            },
          );

          const { meshes, particleSystems, skeletons, animationGroups } =
            result;
          if (meshes.length > 0) {
            meshes.forEach((mesh: AbstractMesh) => {
              if (!mesh.material) {
                mesh.position.y += 2; // Raise the mesh by 5 units
                const newMaterial = new PBRMaterial(
                  `material_${mesh.name}`,
                  scene,
                );
                newMaterial.albedoColor = new Color3(0.5, 0.5, 0.5);
                newMaterial.metallic = 0.1;
                newMaterial.roughness = 0.8;
                mesh.material = newMaterial;
              } else {
                console.log(
                  `Mesh ${mesh.name} has material: ${mesh.material.name}`,
                );
              }
            });
          }

          // Ensure proper lighting
          if (!scene.lights.length) {
            const light = new HemisphericLight(
              "light",
              new Vector3(0, 1, 0),
              scene,
            );
            light.intensity = 1;
          }

          // Setup WebXR
          try {
            const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
              disableDefaultUI: true,
              floorMeshes: [ground],
            });

            // Create Enter VR button
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
          // Remove event listeners
          canvasRef.current?.removeEventListener("wheel", preventDefault);
          canvasRef.current?.removeEventListener("touchmove", preventDefault);
          document.body.style.overflow = "";
        };
      }
    };

    initializeBabylon();

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", preventDefault, { passive: false });
      canvas.addEventListener("touchmove", preventDefault, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", preventDefault);
        canvas.removeEventListener("touchmove", preventDefault);
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default TransformerEmbed;
