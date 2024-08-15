"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import {
  Engine,
  Scene,
  UniversalCamera,
  Vector3,
  HemisphericLight,
  SceneLoader,
  PointLight,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
  PhysicsImpostor,
  StandardMaterial,
  Color3,
  AmmoJSPlugin,
  Matrix,
  DynamicTexture,
  Mesh,
  WebXRDefaultExperience,
  Animation,
  AnimationGroup,
  Quaternion,
  AbstractMesh,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import Ammo from "ammojs-typed";
import * as Colyseus from "colyseus.js";
import { AdvancedDynamicTexture, TextBlock, Button } from "@babylonjs/gui";
import RecordRTC, { MediaStreamRecorder } from "recordrtc";
import { toast } from "react-toastify";

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MAX_TOKENS = 4000;

function generateRandomName(): string {
  const names = [
    "Alex",
    "Blake",
    "Casey",
    "Dana",
    "Ellis",
    "Frankie",
    "Glenn",
    "Harper",
    "Indigo",
    "Jordan",
    "Kelly",
    "Logan",
    "Morgan",
    "Noel",
    "Parker",
    "Quinn",
    "Riley",
    "Sage",
    "Taylor",
    "Val",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function createPlayerAvatar(
  scene: Scene,
  id: string,
  position: Vector3,
  rotation: Vector3,
): { mesh: Mesh; name: string } {
  const avatar = MeshBuilder.CreateBox(
    `player_${id}`,
    { height: 1, width: 1, depth: 1 },
    scene,
  );

  avatar.position = position || new Vector3(0, 5, 0);
  avatar.rotation = rotation || new Vector3(0, 0, 0);

  avatar.physicsImpostor = new PhysicsImpostor(
    avatar,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0.5, restitution: 0.3 },
    scene,
  );
  avatar.visibility = 0;

  let anim: AnimationGroup | null;
  let avatarMesh: AbstractMesh | null;
  SceneLoader.ImportMeshAsync(
    "",
    "https://assets.babylonjs.com/meshes/",
    "HVGirl.glb",
    scene,
  ).then((result) => {
    const hero = result.meshes[0];
    hero.parent = avatar;
    hero.scaling.scaleInPlace(0.25);
    hero.position.y = -0.5;
    anim = scene.getAnimationGroupByName("Walking");
    avatarMesh = hero;
  });

  const playerName = generateRandomName();

  const namePlane = MeshBuilder.CreatePlane(
    "namePlane",
    { width: 2, height: 1 },
    scene,
  );
  namePlane.parent = avatar;
  namePlane.position.y = 6.3;
  namePlane.rotation.x = Math.PI / 2; // Rotate 90 degrees around X-axis to make it horizontal

  const nameTexture = AdvancedDynamicTexture.CreateForMesh(namePlane);
  const nameText = new TextBlock();
  nameText.text = playerName;
  nameText.color = "blue";
  nameText.fontSize = 304;
  nameText.rotation = Math.PI; // Rotate the text 180 degrees to correct its orientation
  nameTexture.addControl(nameText);

  scene.onBeforeRenderObservable.add(() => {
    const camera = scene.activeCamera;
    if (camera) {
      namePlane.lookAt(camera.position);
    }
    console.log(anim);
  });

  return { mesh: avatar, name: playerName };
}

const AvatarSceneContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  let room: Colyseus.Room;
  let playerMesh: { [key: string]: { mesh: Mesh; name: string } } = {};

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  const initializeThread = useCallback(async () => {
    try {
      const res = await fetch("/api/assistants/threads", { method: "POST" });
      const data: { threadId: string } = await res.json();
      setThreadId(data.threadId);
    } catch (error) {
      console.error("Failed to initialize thread:", error);
    }
  }, []);

  useEffect(() => {
    void initializeThread();
  }, [initializeThread]);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const startNewChat = useCallback(async () => {
    stopSpeech();
    setMessages([]);
    setInputDisabled(false);
    await initializeThread();
  }, [stopSpeech, initializeThread]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    Ammo().then((AmmoLib) => {
      scene.enablePhysics(
        new Vector3(0, -9.81, 0),
        new AmmoJSPlugin(true, AmmoLib),
      );

      // Server
      const client = new Colyseus.Client("http://219.77.74.96:2567");
      client
        .joinOrCreate("my_room")
        .then((roomInstance: Colyseus.Room) => {
          room = roomInstance;
          console.log("Connected to roomId: " + room.roomId);

          room.state.players.onAdd((player: any, key: string) => {
            console.log(player.id, "has been added");
            console.log(`pos: ${player.posX} ${player.posY} ${player.posZ}`);
            console.log(room.state);

            let isCurPlayer = room.sessionId === key;

            if (!isCurPlayer) {
              const { mesh, name } = createPlayerAvatar(
                scene,
                player.id,
                new Vector3(player.posX, player.posY, player.posZ),
                new Vector3(player.rotX, player.rotY, player.rotZ),
              );
              playerMesh[key] = { mesh, name };
            }
            player.onChange(() => {
              if (room.sessionId != key) {
                playerMesh[key].mesh.position.set(
                  player.posX,
                  player.posY,
                  player.posZ,
                );
                playerMesh[key].mesh.rotation.set(
                  player.rotX,
                  player.rotY,
                  player.rotZ,
                );
              }
            });
          });

          room.state.players.onRemove((player: any, key: string) => {
            console.log(player.id, "has been removed");
            if (playerMesh[key]) {
              playerMesh[key].mesh.dispose();
              delete playerMesh[key];
            }
          });
        })
        .catch(function (error) {
          console.log("Couldn't connect.", error);
        });

      // Lighting
      const hemisphericLight = new HemisphericLight(
        "light",
        new Vector3(0, 1, 0),
        scene,
      );
      hemisphericLight.intensity = 0.7;

      const pointLight = new PointLight(
        "pointLight",
        new Vector3(0, 5, -5),
        scene,
      );
      pointLight.intensity = 0.5;

      // Create invisible ground for physics
      const invisibleGround = MeshBuilder.CreateGround(
        "invisibleGround",
        { width: 40, height: 50 },
        scene,
      );
      invisibleGround.visibility = 0; // Make it invisible
      invisibleGround.physicsImpostor = new PhysicsImpostor(
        invisibleGround,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene,
      );

      const step = MeshBuilder.CreateBox(
        "step",
        { width: 14, height: 0.7, depth: 12 },
        scene,
      );
      step.position = new Vector3(-2, 0, 18.5);
      step.visibility = 0;
      step.physicsImpostor = new PhysicsImpostor(
        step,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene,
      );

      // Load environment
      SceneLoader.ImportMeshAsync("", "/", "classroom.glb", scene).then(
        (result) => {
          const classroomRoot = result.meshes[0];
          classroomRoot.scaling = new Vector3(3, 3, 3);

          // Ensure materials are properly applied
          result.meshes.forEach((mesh) => {
            if (mesh.material) {
              // mesh.material.needAlphaBlending = true;
              mesh.material.forceDepthWrite = true;
            }
          });

          // Apply physics to the classroom root
          // classroomRoot.physicsImpostor = new PhysicsImpostor(
          //   classroomRoot,
          //   PhysicsImpostor.MeshImpostor,
          //   { mass: 0, restitution: 0.9 },
          //   scene,
          // );

          // Blackboard setup
          const blackboard = classroomRoot
            .getChildMeshes()
            .find((mesh) => mesh.name === "blackboard.001_posters_0");
          if (blackboard) {
            const dynamicTexture = new DynamicTexture(
              "dynamicTexture",
              { width: 1024, height: 512 },
              scene,
              false,
            );
            const textureContext = dynamicTexture.getContext();
            textureContext.clearRect(
              0,
              0,
              dynamicTexture.getSize().width,
              dynamicTexture.getSize().height,
            );
            textureContext.save();
            textureContext.scale(1, -1);
            textureContext.translate(0, -dynamicTexture.getSize().height);
            const url = "/student/content/molecule";
            textureContext.font = "bold 56px Arial";
            textureContext.fillStyle = "white";
            textureContext.fillText(
              "What is DNA?",
              50,
              dynamicTexture.getSize().height / 2,
            );
            textureContext.restore();
            dynamicTexture.update();
            const blackboardMaterial = new StandardMaterial(
              "blackboardMaterial",
              scene,
            );
            blackboardMaterial.diffuseColor = new Color3(1, 1, 1);
            blackboardMaterial.diffuseTexture = dynamicTexture;
            blackboard.material = blackboardMaterial;
            blackboard.actionManager = new ActionManager(scene);
            blackboard.actionManager.registerAction(
              new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                window.location.href = url;
              }),
            );
          }

          // Load avatar model
          SceneLoader.ImportMeshAsync("", "/", "avatar.glb", scene)
            .then((avatarResult) => {
              const avatarRoot = avatarResult.meshes[0];
              avatarRoot.scaling = new Vector3(2.5, 2.5, 2.5);
              avatarRoot.position = new Vector3(-2, 0.2, 20);
              avatarRoot.rotation = new Vector3(0, Math.PI, 0);
              if (avatarResult.animationGroups.length > 0) {
                avatarResult.animationGroups[0].play(true);
              }
            })
            .catch(console.error);

          // WebXR setup
          WebXRDefaultExperience.CreateAsync(scene, {
            disableDefaultUI: true,
            floorMeshes: [invisibleGround], // Use invisibleGround instead of ground
          })
            .then((xrHelper) => {
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
              AdvancedDynamicTexture.CreateFullscreenUI("UI").addControl(
                enterVRButton,
              );
              enterVRButton.horizontalAlignment =
                Button.HORIZONTAL_ALIGNMENT_RIGHT;
              enterVRButton.verticalAlignment =
                Button.VERTICAL_ALIGNMENT_BOTTOM;
              enterVRButton.left = "-20px";
              enterVRButton.top = "-20px";
              if (!xrHelper.baseExperience) {
                enterVRButton.isEnabled = false;
                enterVRButton.background = "grey";
              }
            })
            .catch(console.error);

          // Door setup
          const doorMesh = classroomRoot
            .getChildMeshes()
            .find((mesh) => mesh.name === "door_details_0");
          if (doorMesh) {
            doorMesh.actionManager = new ActionManager(scene);
            doorMesh.actionManager.registerAction(
              new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                window.location.href = "/student/content/transformer";
              }),
            );
            const infoPlane = MeshBuilder.CreatePlane(
              "infoPlane",
              { width: 1, height: 0.3 },
              scene,
            );
            infoPlane.parent = doorMesh;
            infoPlane.position.y = 2.5;
            infoPlane.rotation.y = Math.PI;
            const infoTexture = AdvancedDynamicTexture.CreateForMesh(infoPlane);
            const infoText = new TextBlock();
            infoText.text = "Transformer";
            infoText.color = "white";
            infoText.fontSize = 24;
            infoTexture.addControl(infoText);
          }

          // Shelf setup
          const shelfMesh = classroomRoot
            .getChildMeshes()
            .find((mesh) => mesh.name === "shelf.001_details_0");
          if (shelfMesh) {
            shelfMesh.actionManager = new ActionManager(scene);
            shelfMesh.actionManager.registerAction(
              new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                window.location.href = "/student/content";
              }),
            );
            shelfMesh.actionManager.registerAction(
              new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
                document.body.style.cursor = "pointer";
              }),
            );
            shelfMesh.actionManager.registerAction(
              new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
                document.body.style.cursor = "default";
              }),
            );
          }
        },
      );

      // Avatar setup
      const avatar = MeshBuilder.CreateBox(
        "avatar",
        { height: 1, width: 1, depth: 1 },
        scene,
      );
      avatar.position = new Vector3(0, 5, 0);
      avatar.physicsImpostor = new PhysicsImpostor(
        avatar,
        PhysicsImpostor.BoxImpostor,
        { mass: 1, friction: 0.5, restitution: 0.3 },
        scene,
      );
      avatar.visibility = 0;

      let anim: AnimationGroup | null;
      SceneLoader.ImportMeshAsync(
        "",
        "https://assets.babylonjs.com/meshes/",
        "HVGirl.glb",
        scene,
      ).then((result) => {
        const hero = result.meshes[0];
        hero.parent = avatar;
        hero.scaling.scaleInPlace(0.25);
        hero.position.y = -0.5;
        anim = scene.getAnimationGroupByName("Walking");
      });

      // Camera setup
      const camera = new UniversalCamera(
        "camera",
        new Vector3(0, 5, -10),
        scene,
      );
      camera.setTarget(avatar.position);
      camera.attachControl(canvasRef.current, true);

      let lastSentPos = new Vector3(0, 0, 0);
      let lastSentRot = new Vector3(0, 0, 0);
      const threshold = 0.1;
      // Update camera position in the render loop
      scene.onBeforeRenderObservable.add(() => {
        const cameraOffset = new Vector3(0, 5, -10); // Adjust these values to change camera distance
        camera.position = avatar.position.add(cameraOffset);
        if (room) {
          if (Vector3.Distance(avatar.position, lastSentPos) >= threshold) {
            room.send("updatePosition", avatar.position);
            lastSentPos.copyFrom(avatar.position);
          }
          if (Vector3.Distance(avatar.rotation, lastSentRot) >= threshold) {
            room.send("updateRotation", avatar.rotation);
            lastSentRot.copyFrom(avatar.rotation);
          }
        }
      });

      // Movement controls setup
      const inputMap: { [key: string]: boolean } = {};
      scene.actionManager = new ActionManager(scene);
      scene.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
          inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }),
      );
      scene.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
          inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }),
      );

      // Update loop for smoother movement
      const moveDirection = Vector3.Zero();
      scene.onBeforeRenderObservable.add(() => {
        if (avatar.physicsImpostor) {
          moveDirection.setAll(0);
          if (inputMap["w"] || inputMap["ArrowUp"]) moveDirection.z += 1;
          if (inputMap["s"] || inputMap["ArrowDown"]) moveDirection.z -= 1;
          if (inputMap["a"] || inputMap["ArrowLeft"]) moveDirection.x -= 1;
          if (inputMap["d"] || inputMap["ArrowRight"]) moveDirection.x += 1;

          Vector3.TransformCoordinatesToRef(
            moveDirection.normalize(),
            Matrix.RotationY(camera.rotation.y),
            moveDirection,
          );

          if (moveDirection.length() > 0) {
            anim?.start(true, 1.0, anim.from, anim.to, false);
          } else {
            anim?.stop();
          }

          const currentVelocity =
            avatar.physicsImpostor.getLinearVelocity() || Vector3.Zero();
          const targetVelocity = moveDirection.scale(5);
          const smoothedVelocity = new Vector3(
            lerp(currentVelocity.x, targetVelocity.x, 0.1),
            currentVelocity.y,
            lerp(currentVelocity.z, targetVelocity.z, 0.1),
          );

          avatar.physicsImpostor.setLinearVelocity(smoothedVelocity);
          avatar.rotation = Vector3.Zero();

          avatar.physicsImpostor?.setAngularVelocity(Vector3.Zero()); // Set angular velocity to zero
          avatar.rotation = new Vector3(0, camera.rotation.y, 0);

          if (inputMap[" "] && avatar.position.y <= 1.1) {
            avatar.physicsImpostor.applyImpulse(
              new Vector3(0, 1, 0),
              avatar.getAbsolutePosition(),
            );
          }
        }
      });

      // GUI setup
      const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
      const instructionText = new TextBlock();
      instructionText.text =
        "Use WASD or arrow keys to move\nUse mouse to look around";
      instructionText.color = "white";
      instructionText.fontSize = 20;
      instructionText.top = "20px";
      guiTexture.addControl(instructionText);

      const hideInstruction = () => {
        instructionText.isVisible = false;
        window.removeEventListener("keydown", hideInstruction);
        window.removeEventListener("mousemove", hideInstruction);
      };

      window.addEventListener("keydown", hideInstruction);
      window.addEventListener("mousemove", hideInstruction);

      // Prevent scrolling when spacebar is pressed
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") event.preventDefault();
      };
      canvasRef.current?.addEventListener("keydown", handleKeyDown);

      if (canvasRef.current) {
        engine.runRenderLoop(() => scene.render());
      }
      window.addEventListener("resize", () => engine.resize());

      return () => {
        engine.dispose();
        canvasRef.current?.removeEventListener("keydown", handleKeyDown);
      };
    });
  }, []);

  const sendMessage = async (text: string, audio?: Blob): Promise<void> => {
    try {
      setInputDisabled(true);
      setIsLoading(true);
      setStreamError(null);

      const formData = new FormData();
      if (audio) {
        formData.append("audio", audio, "audio.webm");
      } else {
        formData.append("content", text);
      }

      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            return pump();
            async function pump(): Promise<void> {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
        const assistantStream = AssistantStream.fromReadableStream(stream);
        await handleStream(assistantStream);
      } else {
        throw new Error("Response body is null");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setStreamError(error instanceof Error ? error.message : String(error));
      toast.error("Failed to send message. Please try again.");
    } finally {
      setInputDisabled(false);
      setIsLoading(false);
    }
  };

  const handleStream = (stream: AssistantStream): Promise<void> => {
    return new Promise((resolve, reject) => {
      let assistantResponse = "";
      const timeoutDuration = 30000; // 30 seconds timeout
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout;

      const resetTimeout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error("Stream timeout"));
        }, timeoutDuration);
      };

      // Initial timeout set
      resetTimeout();

      stream.on("textCreated", (): void => {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      });

      stream.on("textDelta", (delta: { value?: string }): void => {
        if (delta.value != null) {
          assistantResponse += delta.value;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = assistantResponse;
            return newMessages;
          });
          speakMessage(delta.value);
        }
        // Reset the timeout on each delta received
        resetTimeout();
      });

      stream.on("event", (event: { event: string }): void => {
        if (event.event === "thread.run.completed") {
          clearTimeout(timeoutId);
          setInputDisabled(false);
          setIsLoading(false);
          resolve();
        }
      });

      stream.on("error", (error: Error) => {
        clearTimeout(timeoutId);
        console.error("Stream error:", error);
        setStreamError(error.message);
        reject(error);
      });

      // Add a 'done' event handler
      stream.on("end", () => {
        clearTimeout(timeoutId);
        setInputDisabled(false);
        setIsLoading(false);
        resolve();
      });

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    });
  };

  const handleUserInput = useCallback(async (): Promise<void> => {
    if (userInput.trim() !== "" || audioBlob) {
      if (audioBlob) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "Audio message" },
        ]);
        await sendMessage("", audioBlob);
        setAudioBlob(null);
      } else {
        setMessages((prev) => [...prev, { role: "user", content: userInput }]);
        await sendMessage(userInput);
      }
      setUserInput("");
    }
  }, [userInput, audioBlob, sendMessage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Enter" && inputDisabled !== null && !inputDisabled) {
        void handleUserInput();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUserInput, inputDisabled]);

  useEffect(() => {
    if (chatContainerRef.current !== null) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
      });

      recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingStatus("Recording...");
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingStatus("Error starting recording");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        setAudioBlob(blob || null);
        setIsRecording(false);
        setRecordingStatus("Recording stopped");

        // Stop all tracks of the stored MediaStream
        if (mediaStream instanceof MediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
        setMediaStream(null);
        setRecordingStatus("Recording stopped");
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const renderMessage = (msg: MessageType, id: number): JSX.Element => (
    <div
      key={id}
      className={`mb-2 p-3 rounded-lg ${
        msg.role === "user"
          ? "bg-blue-50 border-blue-200"
          : "bg-green-50 border-green-200"
      } border max-w-full break-words shadow-sm`}
    >
      <div className="flex items-center mb-1">
        {msg.role === "user" ? (
          <FaGraduationCap className="mr-2 text-blue-500" />
        ) : (
          <FaChalkboardTeacher className="mr-2 text-green-500" />
        )}
        <strong className="font-semibold text-sm text-gray-700">
          {msg.role === "user" ? "Student" : "Teacher"}
        </strong>
      </div>
      <ReactMarkdown
        className="mt-1 text-sm text-gray-800"
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className ?? "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${className} bg-gray-100 rounded px-1 py-0.5 text-sm`}
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ children }) => (
            <p className="mb-2 max-w-full break-words">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-3 italic my-2 text-gray-600">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto my-2 rounded"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 my-2 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 py-1 bg-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 py-1">{children}</td>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {msg.content ?? ""}
      </ReactMarkdown>
    </div>
  );

  const speakMessage = useCallback(
    (text: string) => {
      if (!isSpeechEnabled || !selectedVoice) return;

      // Clean the text: remove punctuation and extra spaces
      const cleanedText = text
        .trim()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ");

      // Split the cleaned text into smaller chunks
      const words = cleanedText.split(" ");
      const chunks = [];
      let currentChunk = "";

      for (const word of words) {
        if ((currentChunk + " " + word).length <= 100) {
          currentChunk += (currentChunk ? " " : "") + word;
        } else {
          chunks.push(currentChunk);
          currentChunk = word;
        }
      }
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      chunks.forEach((chunk, index) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.voice = selectedVoice;
        utterance.lang = "en-US";
        utterance.rate = 1.3; // Slightly faster than normal
        utterance.pitch = 1.1; // Normal pitch

        // Reduce pauses between chunks
        if (index < chunks.length - 1) {
          utterance.onend = () => {
            window.speechSynthesis.resume();
          };
        }

        window.speechSynthesis.speak(utterance);
      });
    },
    [isSpeechEnabled, selectedVoice],
  );

  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled((prev) => {
      if (prev) {
        stopSpeech();
      }
      return !prev;
    });
  }, [stopSpeech]);

  const VoiceSelector = () => {
    const voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang.startsWith("en"));

    return (
      <select
        value={selectedVoice?.name}
        onChange={(e) => {
          const newVoice = voices.find(
            (voice) => voice.name === e.target.value,
          );
          if (newVoice) setSelectedVoice(newVoice);
        }}
        className="ml-2 p-1 border rounded text-sm"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name.split(" ")[0]}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="flex w-full h-[90vh]">
      <canvas
        ref={canvasRef}
        className="w-[70%] h-full"
        tabIndex={1}
        onFocus={(e) => (e.currentTarget.style.outline = "none")}
      />
      <div className="w-[30%] h-full flex flex-col bg-gray-50 border-l border-gray-200">
        <div className="p-2 bg-yellow-100 text-yellow-800 text-sm">
          Recording Status: {recordingStatus}
        </div>
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Virtual Classroom Chat
          </h2>
          <button
            onClick={() => void startNewChat()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Chat
          </button>
        </div>
        {messages.length === 0 && (
          <div className="m-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <p className="font-semibold mb-1">
              Welcome to the Virtual Classroom!
            </p>
            <p>
              Feel free to ask the teacher any questions about your studies. I
              am here to help!
            </p>
          </div>
        )}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2"
        >
          {messages.map(renderMessage)}
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={toggleSpeech}
              className={`px-3 py-1 rounded text-sm ${
                isSpeechEnabled
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isSpeechEnabled ? "Speech On" : "Speech Off"}
            </button>
            {isSpeechEnabled && <VoiceSelector />}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask the teacher a question..."
              disabled={inputDisabled}
              className="flex-1 p-2 mr-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={toggleRecording}
              className={`p-2 mr-2 rounded-full ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button
              onClick={() => void handleUserInput()}
              disabled={inputDisabled || (!userInput.trim() && !audioBlob)}
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
        {streamError && (
          <div className="p-2 bg-red-100 text-red-800 text-sm">
            Error: {streamError}
          </div>
        )}
      </div>
    </div>
  );
};

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

export default AvatarSceneContent;
