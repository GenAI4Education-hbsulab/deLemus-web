"use client";

import React, { useState, useEffect, useRef } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, TransformNode, PointLight, KeyboardEventTypes } from "@babylonjs/core";
import "@babylonjs/loaders";

type MessageType = {
  role: "user" | "assistant";
  content: string;
};

const AvatarSceneContent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [threadId, setThreadId] = useState<string>("");
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize thread
        const createThread = async () => {
            const res = await fetch(`/api/assistants/threads`, { method: "POST" });
            const data = await res.json();
            setThreadId(data.threadId);
        };
        createThread();

        // Initialize 3D scene
        if (!canvasRef.current) return;
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        // Prevent default scroll behavior on mouse wheel and touch events
        const preventDefault = (e: Event) => e.preventDefault();
        canvasRef.current.addEventListener("wheel", preventDefault, { passive: false });
        canvasRef.current.addEventListener("touchmove", preventDefault, { passive: false });
        
        // Camera setup
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
        camera.attachControl(canvasRef.current, true);
        camera.checkCollisions = true;
        camera.collisionRadius = new Vector3(1, 1, 1);
        scene.collisionsEnabled = true;

        // Lighting
        new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        const pointLight = new PointLight("pointLight", new Vector3(0, 5, -5), scene);

        // Load environment
        SceneLoader.Append("/", "classroom.glb", scene, (scene) => {
            const rootNodes = scene.rootNodes;
            rootNodes.forEach(node => {
                if (node instanceof TransformNode) {
                    node.scaling = new Vector3(50, 50, 50);
                    node.position = new Vector3(0, -1, 0);
                }
            });
        });

        // Load avatar model
        SceneLoader.ImportMesh("", "/", "avatar.glb", scene, (meshes) => {
            const avatar = meshes[0];
            avatar.scaling = new Vector3(1, 1, 1);
            avatar.position = new Vector3(0, 0, 0);

            avatar.getChildMeshes().forEach(child => {
                child.position = new Vector3(40, 8, -350);
            });
        });

        // VR setup
        scene.createDefaultXRExperienceAsync().then((xrExperience) => {
            xrExperience.input.onControllerAddedObservable.add((controller) => {
                controller.onMotionControllerInitObservable.add((motionController) => {
                    const triggerComponent = motionController.getComponent("trigger");
                    triggerComponent.onButtonStateChangedObservable.add(() => {
                        if (triggerComponent.pressed) {
                            handleUserInput();
                        }
                    });
                });
            });
        });

        // Keyboard controls for non-VR interaction
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN && kbInfo.event.key === "Enter") {
                handleUserInput();
            }
        });

        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());

        return () => {
            engine.dispose();
            if (canvasRef.current) {
                canvasRef.current.removeEventListener("wheel", preventDefault);
                canvasRef.current.removeEventListener("touchmove", preventDefault);
            }
        };
    }, []);

    const sendMessage = async (text: string) => {
        const response = await fetch(`/api/assistants/threads/${threadId}/messages`, {
            method: "POST",
            body: JSON.stringify({ content: text }),
        });
        if (response.body) {
            const stream = AssistantStream.fromReadableStream(response.body);
            handleStream(stream);
        }
    };

    const handleStream = (stream: AssistantStream) => {
        let assistantResponse = "";
        stream.on("textCreated", () => {
            setMessages(prev => [...prev, { role: "assistant", content: "" }]);
        });
        stream.on("textDelta", (delta: any) => {
            if (delta.value) {
                assistantResponse += delta.value;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantResponse;
                    return newMessages;
                });
            }
        });
        stream.on("event", (event: any) => {
            if (event.event === "thread.run.completed") setInputDisabled(false);
        });
    };

    const handleUserInput = async () => {
        if (userInput.trim()) {
            setMessages(prev => [...prev, { role: "user", content: userInput }]);
            setUserInput("");
            setInputDisabled(true);
            await sendMessage(userInput);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                handleUserInput();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleUserInput]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "row" }}>
            <canvas ref={canvasRef} style={{ width: "70%", height: "100%" }} />
            <div style={{ width: "30%", height: "100%", display: "flex", flexDirection: "column", padding: "10px", backgroundColor: "#f0f0f0" }}>
                <div ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <strong>{msg.role === "user" ? "You" : "Avatar"}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask the avatar a question..."
                    style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
                    onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
                    disabled={inputDisabled}
                />
                <button onClick={handleUserInput} style={{ padding: "5px 10px" }} disabled={inputDisabled}>Send</button>
            </div>
        </div>
    );
};

export default AvatarSceneContent;