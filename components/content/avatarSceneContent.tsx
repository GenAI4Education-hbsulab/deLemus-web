"use client";
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Body, Box, Plane, Vec3, World, ConvexPolyhedron } from "cannon-es";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";

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

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Physics setup
    const world = new World();
    world.gravity.set(0, -9.81, 0);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 20, -10);
    scene.add(dirLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ground physics
    const groundBody = new Body({
      mass: 0,
      shape: new Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Load environment
    const loader = new GLTFLoader();
    loader.load("/classroom.glb", (gltf: any) => {
      const classroom = gltf.scene;
      classroom.scale.set(2, 2, 2);
      scene.add(classroom);

      // Create physics bodies for classroom meshes
      classroom.traverse((child: any) => {
        if (child.isMesh) {
          const vertices = child.geometry.attributes.position.array;
          const indices = child.geometry.index.array;
          const shape = new ConvexPolyhedron({
            vertices: vertices.map(
              (v: number, i: number) =>
                new Vec3(
                  vertices[i * 3],
                  vertices[i * 3 + 1],
                  vertices[i * 3 + 2],
                ),
            ),
            faces: indices.map((i: number, j: number) =>
              indices.slice(j * 3, j * 3 + 3),
            ),
          });
          const body = new Body({
            mass: 0,
            position: new Vec3(
              child.position.x,
              child.position.y,
              child.position.z,
            ),
            shape: shape,
          });
          world.addBody(body);
        }
      });
    });

    // Avatar setup
    let avatar: VRM | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const ava_loader = new GLTFLoader();
    ava_loader.register((parser: any) => new VRMLoaderPlugin(parser));
    ava_loader.load(
      "/avatar.vrm",
      (gltf: any) => {
        avatar = gltf.userData.vrm;
        if (avatar) {
          avatar.scene.scale.set(2, 2, 2); // Scale the avatar
          avatar.scene.rotation.y = Math.PI; // Rotate the avatar by 180 degrees
          scene.add(avatar.scene);

          // Set up animation mixer
          mixer = new THREE.AnimationMixer(avatar.scene);

          console.log("anime", gltf.animations);
          const walkClip = gltf.animations.find(
            (clip: any) => clip.name === "walk",
          );
          const jumpClip = gltf.animations.find(
            (clip: any) => clip.name === "jump",
          );

          if (walkClip) {
            const walkAction = mixer.clipAction(walkClip);
            walkAction.play();
          }

          if (jumpClip) {
            const jumpAction = mixer.clipAction(jumpClip);
          }
        }
      },
      (progress: any) =>
        console.log(
          "Loading model...",
          100.0 * (progress.loaded / progress.total),
          "%",
        ),
      (error: any) => console.error(error),
    );

    // Camera setup
    const cameraOffset = new THREE.Vector3(0, 5, -10);

    // Movement controls setup
    const moveDirection = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const inputMap: { [key: string]: boolean } = {};

    window.addEventListener("keydown", (event) => {
      inputMap[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
      inputMap[event.key] = false;
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      // Update physics
      world.step(1 / 60);

      // Update avatar position
      if (avatar) {
        avatar.update(0.016); // Update the VRM model
      }

      // Update animations
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // Movement logic
      moveDirection.set(0, 0, 0);

      if (inputMap["w"] || inputMap["ArrowUp"]) moveDirection.z -= 1;
      if (inputMap["s"] || inputMap["ArrowDown"]) moveDirection.z += 1;
      if (inputMap["a"] || inputMap["ArrowLeft"]) moveDirection.x -= 1;
      if (inputMap["d"] || inputMap["ArrowRight"]) moveDirection.x += 1;

      if (moveDirection.length() > 0) {
        moveDirection.normalize();
        velocity.copy(moveDirection).multiplyScalar(0.1);
        avatar?.scene.position.add(velocity);
      }

      // Update camera position to follow the avatar
      const cameraPosition =
        avatar?.scene.position.clone().add(cameraOffset) || cameraOffset;
      camera.position.lerp(cameraPosition, 0.1); // Smooth transition
      camera.lookAt(avatar?.scene.position || new THREE.Vector3(0, 0, 0));

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      // Cleanup
      renderer.dispose();
      window.removeEventListener("resize", () => {});
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
          setTokenCount((prev) => prev + (delta.value?.length ?? 0));
        }
      });

      stream.on("end", (): void => {
        clearTimeout(timeout);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = assistantResponse;
          }
          return [...prev];
        });
        setInputDisabled(false);
        resolve();
      });

      stream.on("error", (error: Error): void => {
        clearTimeout(timeout);
        console.error("Stream error:", error);
        setInputDisabled(false);
        reject(error);
      });
    });
  };

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
                // void handleUserInput();
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
