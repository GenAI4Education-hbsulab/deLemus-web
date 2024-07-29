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
  TransformNode,
  PointLight,
  KeyboardEventTypes,
  type KeyboardInfo,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
  Scalar,
  Quaternion,
  Ray,
} from "@babylonjs/core";

import "@babylonjs/loaders";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

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

const MAX_TOKENS = 4000; // Adjust this value based on your model's limit

const AvatarSceneContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [threadId, setThreadId] = useState<string>("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const initializeThread = useCallback(async (): Promise<void> => {
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
    if (canvasRef.current === null) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // Avatar setup
    let avatar = MeshBuilder.CreateBox(
      "avatar",
      { height: 2, width: 1, depth: 1 },
      scene,
    );
    avatar.position = new Vector3(0, 1, 0);
    avatar.rotationQuaternion = Quaternion.Identity();

    // Camera setup
    const camera = new UniversalCamera("camera", new Vector3(0, 2, -10), scene);
    camera.setTarget(avatar.position);

    // Camera parent for smooth following
    const camRoot = new TransformNode("root");
    camRoot.position = avatar.position.clone();
    camRoot.rotation = new Vector3(0, Math.PI, 0);
    camera.parent = camRoot;

    // Movement variables
    let moveDirection = Vector3.Zero();
    let inputMap: { [key: string]: boolean } = {};
    let grounded = false;
    let jumpCount = 0;
    const PLAYER_SPEED = 0.1;
    const JUMP_FORCE = 0.2;
    const GRAVITY = -0.005;

    // Movement controls
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

    // Update movement and camera
    scene.registerBeforeRender(() => {
      let deltaTime = engine.getDeltaTime() / 1000;

      // Update movement
      moveDirection = Vector3.Zero();
      if (inputMap["w"] || inputMap["ArrowUp"]) moveDirection.z += 1;
      if (inputMap["s"] || inputMap["ArrowDown"]) moveDirection.z -= 1;
      if (inputMap["a"] || inputMap["ArrowLeft"]) moveDirection.x -= 1;
      if (inputMap["d"] || inputMap["ArrowRight"]) moveDirection.x += 1;

      // Normalize movement vector
      if (moveDirection.length() > 0) {
        moveDirection = moveDirection.normalize();
      }

      // Rotate movement based on camera angle
      let angle = camRoot.rotation.y;
      let rotatedMovement = new Vector3(
        moveDirection.x * Math.cos(angle) + moveDirection.z * Math.sin(angle),
        0,
        moveDirection.z * Math.cos(angle) - moveDirection.x * Math.sin(angle),
      );

      // Apply movement
      avatar.position.addInPlace(rotatedMovement.scale(PLAYER_SPEED));

      // Jumping
      if (inputMap[" "] && grounded) {
        avatar.position.y += JUMP_FORCE;
        grounded = false;
        jumpCount = 1;
      }

      // Gravity
      if (!grounded) {
        avatar.position.y += GRAVITY * deltaTime;
      }

      // Ground check
      let origin = avatar.position.clone();
      origin.y += 0.5;
      let ray = new Ray(origin, Vector3.Down(), 1.1);
      let pick = scene.pickWithRay(ray);

      if (pick && pick.hit && pick.distance <= 0.6) {
        grounded = true;
        avatar.position.y = pick.pickedPoint!.y + 1;
        jumpCount = 0;
      } else {
        grounded = false;
      }

      // Rotate avatar to face movement direction
      if (rotatedMovement.length() > 0) {
        let targetRotation = Math.atan2(rotatedMovement.x, rotatedMovement.z);
        let currentRotation = avatar.rotationQuaternion!.toEulerAngles().y;
        let newRotation = Scalar.Lerp(currentRotation, targetRotation, 0.1);
        avatar.rotationQuaternion = Quaternion.FromEulerAngles(
          0,
          newRotation,
          0,
        );
      }

      // Update camera position
      camRoot.position = Vector3.Lerp(
        camRoot.position,
        new Vector3(
          avatar.position.x,
          avatar.position.y + 2,
          avatar.position.z,
        ),
        0.4,
      );
    });

    // Lighting
    void new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    void new PointLight("pointLight", new Vector3(0, 5, -5), scene);

    // Load environment and avatar
    void SceneLoader.AppendAsync("/", "classroom.glb", scene).then(() => {
      const classroomRoot = scene.getNodeByName("__root__");
      if (classroomRoot instanceof TransformNode) {
        classroomRoot.scaling = new Vector3(10, 10, 10);
      }

      void SceneLoader.ImportMeshAsync("", "/", "avatar.glb", scene).then(
        (result) => {
          const avatarRoot = new TransformNode("avatarRoot", scene);
          result.meshes.forEach((mesh) => {
            mesh.parent = avatarRoot;
          });
          avatarRoot.rotation = new Vector3(0, Math.PI, 0);
          avatarRoot.scaling = new Vector3(0.1, 0.1, 0.1);
          avatarRoot.position = new Vector3(-7, 2, 60);
        },
      );
    });

    // Create a GUI layer
    const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Add instruction text
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
      if (event.code === "Space") {
        event.preventDefault();
      }
    };

    // Add event listener to the canvas
    canvasRef.current.addEventListener("keydown", handleKeyDown);

    engine.runRenderLoop(() => {
      scene.render();
    });
    window.addEventListener("resize", () => {
      engine.resize();
    });

    return (): void => {
      engine.dispose();
      // Remove event listener when component unmounts
      canvasRef.current?.removeEventListener("keydown", handleKeyDown);
    };
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
      }, 30000); // 30 seconds timeout

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
    // This is a very rough estimate. For more accurate results,
    // you might want to use a tokenizer library specific to your model.
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
        {/* eslint-disable-next-line react/no-unescaped-entities */}
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
        // Add onFocus to ensure canvas can receive keyboard events
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

export default AvatarSceneContent;
