"use client";
/* eslint-disable @typescript-eslint/explicit-function-return-type */

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
  WebXRDefaultExperience,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import Ammo from "ammojs-typed";
import { AdvancedDynamicTexture, TextBlock, Button } from "@babylonjs/gui";

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

const AvatarSceneContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    Ammo().then((AmmoLib) => {
      scene.enablePhysics(
        new Vector3(0, -9.81, 0),
        new AmmoJSPlugin(true, AmmoLib),
      );

      // Lighting
      new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      new PointLight("pointLight", new Vector3(0, 5, -5), scene).intensity =
        0.5;

      // Create ground
      const ground = MeshBuilder.CreateGround(
        "ground",
        { width: 100, height: 100 },
        scene,
      );
      ground.material = new StandardMaterial("groundMaterial", scene);
      (ground.material as StandardMaterial).diffuseColor = new Color3(
        0.5,
        0.5,
        0.5,
      );
      ground.physicsImpostor = new PhysicsImpostor(
        ground,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene,
      );

      // Load environment
      SceneLoader.ImportMeshAsync("", "/", "classroom.glb", scene).then(
        (result) => {
          const classroomRoot = result.meshes[0];
          classroomRoot.scaling = new Vector3(3, 3, 3);
          classroomRoot.physicsImpostor = new PhysicsImpostor(
            classroomRoot,
            PhysicsImpostor.MeshImpostor,
            { mass: 0, restitution: 0.9 },
            scene,
          );

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
            floorMeshes: [ground],
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

      // Camera setup
      const camera = new UniversalCamera(
        "camera",
        new Vector3(0, 5, -10),
        scene,
      );
      camera.setTarget(avatar.position);
      camera.attachControl(canvasRef.current, true);

      // Update camera position in the render loop
      scene.onBeforeRenderObservable.add(() => {
        camera.position = avatar.position.add(new Vector3(0, 5, -10));
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

          const currentVelocity =
            avatar.physicsImpostor.getLinearVelocity() || Vector3.Zero();
          const targetVelocity = moveDirection.scale(5);
          const smoothedVelocity = new Vector3(
            lerp(currentVelocity.x, targetVelocity.x, 0.1),
            currentVelocity.y,
            lerp(currentVelocity.z, targetVelocity.z, 0.1),
          );

          avatar.physicsImpostor.setLinearVelocity(smoothedVelocity);

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

  const sendMessage = async (text: string, retryCount = 0): Promise<void> => {
    try {
      setInputDisabled(true);
      setTokenCount(0);

      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: text, max_tokens: MAX_TOKENS }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.body !== null) {
        const stream = AssistantStream.fromReadableStream(response.body);
        await handleStream(stream);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setInputDisabled(false);
    }
  };

  const handleStream = (stream: AssistantStream): Promise<void> => {
    return new Promise((resolve, reject) => {
      let assistantResponse = "";
      const timeout = setTimeout(() => {
        reject(new Error("Stream timeout"));
      }, 30000);

      stream.on("textCreated", (): void => {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      });

      stream.on("textDelta", (delta: { value?: string }): void => {
        if (delta.value != null) {
          assistantResponse += delta.value;
          setTokenCount(
            (prevCount) => prevCount + estimateTokens(delta.value!),
          );
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = assistantResponse;
            return newMessages;
          });
        }
      });

      stream.on("event", (event: { event: string }): void => {
        if (event.event === "thread.run.completed") {
          clearTimeout(timeout);
          setInputDisabled(false);
          resolve();
        }
      });

      stream.on("error", (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  };

  const estimateTokens = (text: string): number => {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  };

  const handleUserInput = useCallback(async (): Promise<void> => {
    if (userInput.trim() !== "") {
      setMessages((prev) => [...prev, { role: "user", content: userInput }]);
      setUserInput("");
      setInputDisabled(true);
      await sendMessage(userInput);
    }
  }, [userInput, sendMessage]);

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

  const renderMessage = (msg: MessageType, id: number): JSX.Element => (
    <div
      key={id}
      className={`mb-4 p-3 rounded-lg ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"} max-w-full break-words`}
    >
      <div className="flex items-center mb-2">
        {msg.role === "user" ? (
          <FaGraduationCap className="mr-2" />
        ) : (
          <FaChalkboardTeacher className="mr-2" />
        )}
        <strong className="font-bold">
          {msg.role === "user" ? "Student" : "Teacher"}:
        </strong>
      </div>
      <ReactMarkdown
        className="mt-2"
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
                className={`${className} bg-gray-100 rounded px-1`}
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
            <h1 className="text-2xl font-bold mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-400 pl-4 italic my-2">
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
              <table className="table-auto border-collapse border border-gray-300 my-2">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {msg.content ?? ""}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="flex w-full h-[90vh]">
      <canvas
        ref={canvasRef}
        className="w-[70%] h-full"
        tabIndex={1}
        onFocus={(e) => (e.currentTarget.style.outline = "none")}
      />
      <div className="w-[30%] h-full flex flex-col p-4 bg-gray-100">
        {messages.length === 0 && (
          <div className="mb-4 p-3 bg-yellow-100 rounded-lg">
            <p className="font-bold">Welcome to the Virtual Classroom!</p>
            <p>
              Feel free to ask the teacher any questions about your studies. I
              am here to help!
            </p>
          </div>
        )}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 max-h-[calc(90vh-100px)]"
        >
          {messages.map(renderMessage)}
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 mb-2">
            Tokens: {tokenCount} / {MAX_TOKENS}
          </div>
          <div className="flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
              placeholder="Ask the teacher a question..."
              disabled={inputDisabled}
              className="flex-1 p-2 mr-2 border rounded"
            />
            <button
              onClick={() => {
                void handleUserInput();
              }}
              disabled={inputDisabled || tokenCount >= MAX_TOKENS}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

export default AvatarSceneContent;
