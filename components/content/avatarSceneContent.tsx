"use client";

import React, { useState, useEffect, useRef } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, TransformNode, PointLight, KeyboardEventTypes } from "@babylonjs/core";
import "@babylonjs/loaders";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

type MessageType = {
  role: "user" | "assistant";
  content: string;
};

interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

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

    const renderMessage = (msg: MessageType ,id  :number) => (
        <div key={id} className={`mb-4 p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'} max-w-full break-words`}>
            <strong className="font-bold">{msg.role === "user" ? "You" : "Avatar"}:</strong>
            <ReactMarkdown
                className="mt-2"
                components={{
                    code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={`${className} bg-gray-100 rounded px-1`} {...props}>
                                {children}
                            </code>
                        )
                    },
                    p: ({children}) => <p className="mb-2 max-w-full break-words">{children}</p>,
                    h1: ({children}) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
                    ul: ({children}) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                    li: ({children}) => <li className="mb-1">{children}</li>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-gray-400 pl-4 italic my-2">{children}</blockquote>,
                    a: ({href, children}) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                    img: ({src, alt}) => <img src={src} alt={alt} className="max-w-full h-auto my-2 rounded" />,
                    table: ({children}) => <div className="overflow-x-auto"><table className="table-auto border-collapse border border-gray-300 my-2">{children}</table></div>,
                    th: ({children}) => <th className="border border-gray-300 px-4 py-2 bg-gray-100">{children}</th>,
                    td: ({children}) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                }}
                remarkPlugins={[remarkGfm]}
            >
                {msg.content}
            </ReactMarkdown>
        </div>
    );

    return (
        <div className="flex w-full h-[90vh]">
            <canvas ref={canvasRef} className="w-[70%] h-full" />
            <div className="w-[30%] h-full flex flex-col p-4 bg-gray-100">
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 max-h-[calc(90vh-100px)]">
                    {messages.map(renderMessage)}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask the avatar a question..."
                        onKeyDown={(e) => e.key === "Enter" && handleUserInput()}
                        disabled={inputDisabled}
                        className="flex-1 p-2 mr-2 border rounded"
                    />
                    <button 
                        onClick={handleUserInput} 
                        disabled={inputDisabled}
                        className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarSceneContent;