"use client";
import React, { useEffect, useRef, useState } from "react";
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
  WebXRDefaultExperience,
  VideoTexture,
  DynamicTexture,
  AbstractMesh,
  PBRMaterial,
  SpotLight,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/gui";
import {
  AdvancedDynamicTexture,
  Button,
  ScrollViewer,
  TextBlock,
} from "@babylonjs/gui";

const TransformerEmbed: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [notesContent, setNotesContent] = useState<string>("");

  useEffect(() => {
    // Fetch the notes content
    fetch("/lecture-notes.md")
      .then((response) => response.text())
      .then((text) => setNotesContent(text))
      .catch((error) => console.error("Error loading notes:", error));

    const preventDefault = (e: Event) => e.preventDefault();

    const initializeBabylon = async () => {
      if (canvasRef.current) {
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        scene.clearColor = new Color4(1, 1, 1, 1);
        scene.audioEnabled = true;

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

        const ground = Mesh.CreateGround("ground", 500, 500, 10, scene);
        const groundMaterial = new StandardMaterial("groundMat", scene);
        groundMaterial.diffuseColor = new Color3(1, 1, 1);
        ground.material = groundMaterial;

        const createScene = async () => {
          const result = await SceneLoader.ImportMeshAsync(
            "",
            "/",
            "transformer.glb",
            scene,
          );

          const { meshes } = result;
          if (meshes.length > 0) {
            meshes.forEach((mesh: AbstractMesh) => {
              if (!mesh.material) {
                mesh.position.y += 2;
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

          if (!scene.lights.length) {
            const light = new HemisphericLight(
              "light",
              new Vector3(0, 1, 0),
              scene,
            );
            light.intensity = 1;
          }

          try {
            const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
              disableDefaultUI: true,
              floorMeshes: [ground],
            });

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

            enterVRButton.horizontalAlignment =
              Button.HORIZONTAL_ALIGNMENT_RIGHT;
            enterVRButton.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
            enterVRButton.left = "-20px";
            enterVRButton.top = "-20px";

            if (!xrHelper.baseExperience) {
              enterVRButton.isEnabled = false;
              enterVRButton.background = "grey";
            }
          } catch (error) {
            console.error("Error initializing WebXR:", error);
          }

          const videoPlane = Mesh.CreatePlane("videoPlane", 10, scene);
          videoPlane.position = new Vector3(0, 5, -10);
          const videoMaterial = new StandardMaterial("videoMat", scene);
          const videoTexture = new VideoTexture(
            "video",
            "/transformer.mp4",
            scene,
            true,
          );
          videoMaterial.diffuseTexture = videoTexture;
          videoMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5);
          videoTexture.video.muted = false;
          videoTexture.video.volume = 1.0;
          videoTexture.video.play();
          videoTexture.video.onplaying = () => {
            console.log("Video is playing");
          };
          videoPlane.material = videoMaterial;

          // Lecture notes
          const notesPlane = Mesh.CreatePlane("notesPlane", 8, scene);
          notesPlane.position = new Vector3(-10, 5, -10);
          notesPlane.rotation.y = 0;

          const notesMaterial = new StandardMaterial("notesMat", scene);
          notesPlane.material = notesMaterial;

          const advancedTexture = AdvancedDynamicTexture.CreateForMesh(
            notesPlane,
            1024,
            1024,
          );

          const scrollViewer = new ScrollViewer();
          scrollViewer.width = 1;
          scrollViewer.height = 1;
          scrollViewer.background = "white";
          advancedTexture.addControl(scrollViewer);

          const textBlock = new TextBlock();
          textBlock.text = notesContent;
          textBlock.color = "black";
          textBlock.fontSize = 24;
          textBlock.textWrapping = true;
          textBlock.width = 0.9;
          textBlock.height = "1000px";
          scrollViewer.addControl(textBlock);

          // Add scroll buttons
          const upButton = Button.CreateSimpleButton("upButton", "▲");
          upButton.width = "50px";
          upButton.height = "50px";
          upButton.color = "white";
          upButton.background = "green";
          upButton.verticalAlignment = 0;
          upButton.left = "460px";
          upButton.top = "10px";
          upButton.onPointerUpObservable.add(() => {
            scrollViewer.verticalBar.value -= 0.1;
          });
          advancedTexture.addControl(upButton);

          const downButton = Button.CreateSimpleButton("downButton", "▼");
          downButton.width = "50px";
          downButton.height = "50px";
          downButton.color = "white";
          downButton.background = "green";
          downButton.verticalAlignment = 1;
          downButton.left = "460px";
          downButton.top = "-10px";
          downButton.onPointerUpObservable.add(() => {
            scrollViewer.verticalBar.value += 0.1;
          });
          advancedTexture.addControl(downButton);

          const screenLight = new SpotLight(
            "screenLight",
            new Vector3(0, 15, 0),
            new Vector3(0, -1, -0.5),
            Math.PI / 2,
            10,
            scene,
          );
          screenLight.diffuse = new Color3(1, 1, 1);
          screenLight.specular = new Color3(1, 1, 1);
          screenLight.intensity = 2;

          videoMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5);
          notesMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5);

          // Create a plane for the button
          const buttonPlane = MeshBuilder.CreatePlane(
            "buttonPlane",
            { width: 2, height: 0.5 },
            scene,
          );
          buttonPlane.parent = videoPlane;
          buttonPlane.position.y = -4; // Adjust this to position the button at the bottom of the video
          buttonPlane.position.z = -0.01; // Slightly in front of the video plane

          // Create dynamic texture for the button text
          const buttonTexture = new DynamicTexture(
            "buttonTexture",
            { width: 256, height: 64 },
            scene,
          );
          const buttonMaterial = new StandardMaterial("buttonMaterial", scene);
          buttonMaterial.diffuseTexture = buttonTexture;
          buttonPlane.material = buttonMaterial;

          // Function to update button text
          function updateButtonText(text: string) {
            const ctx = buttonTexture.getContext();
            ctx.clearRect(0, 0, 256, 64);
            ctx.fillStyle = "white";
            ctx.font = "bold 40px Arial";
            // ctx.textAlign = "center";
            // ctx.textBaseline = "middle";
            ctx.fillText(text, 128, 32);
            buttonTexture.update();
          }

          // Initial text
          updateButtonText("Play");

          // Add click action to the button
          buttonPlane.actionManager = new ActionManager(scene);
          buttonPlane.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
              if (videoTexture.video.paused) {
                videoTexture.video.play();
                updateButtonText("Pause");
                buttonMaterial.diffuseColor = new Color3(1, 0, 0); // Red when playing
              } else {
                videoTexture.video.pause();
                updateButtonText("Play");
                buttonMaterial.diffuseColor = new Color3(0, 1, 0); // Green when paused
              }
            }),
          );

          engine.runRenderLoop(() => {
            scene.render();
          });

          window.addEventListener("resize", () => {
            engine.resize();
          });

          return () => {
            engine.dispose();
            canvasRef.current?.removeEventListener("wheel", preventDefault);
            canvasRef.current?.removeEventListener("touchmove", preventDefault);
            document.body.style.overflow = "";
          };
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
  }, [notesContent]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default TransformerEmbed;
