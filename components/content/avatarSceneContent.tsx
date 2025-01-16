"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import RecordRTC from "recordrtc";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

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

const VoiceSelector: React.FC<{
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}> = ({ selectedVoice, onVoiceChange }) => {
  const voices = ["Monica", "Michelle", "Roger", "Steffan"];
  return (
    <select
      value={selectedVoice}
      onChange={(e) => onVoiceChange(e.target.value)}
      className="ml-2 p-1 border rounded text-xs"
    >
      {voices.map((voice) => (
        <option key={voice} value={voice}>
          {voice}
        </option>
      ))}
    </select>
  );
};

const MessageRenderer: React.FC<{ messages: MessageType[] }> = ({
  messages,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {messages.map((msg, id) => (
        <div
          key={id}
          className={`mb-1 p-1 rounded-lg ${
            msg.role === "user"
              ? "bg-blue-50 border-blue-200"
              : "bg-green-50 border-green-200"
          } border max-w-full break-words shadow-sm text-xs`}
        >
          <div className="flex items-center mb-1">
            {msg.role === "user" ? (
              <FaGraduationCap className="mr-1 text-blue-500" size={10} />
            ) : (
              <FaChalkboardTeacher className="mr-1 text-green-500" size={10} />
            )}
            <strong className="font-semibold text-xs text-gray-700">
              {msg.role === "user" ? "Student" : "Teacher"}
            </strong>
          </div>
          <ReactMarkdown
            className="mt-1 text-xs text-gray-800"
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
                    className={`${className} bg-gray-100 rounded px-1 py-0.5 text-xs`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
            remarkPlugins={[remarkGfm]}
          >
            {msg.content ?? ""}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

const AvatarSceneContent: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<string>("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("Monica");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const { userId, isLoaded, isSignedIn } = useAuth();

  const fetchChatHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`/api/chat-history/${userId}`);
      const history: { message: MessageType }[] = response.data;
      setMessages(history.map(({ message }) => message));
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      //fetchChatHistory();
    }
  }, [isLoaded, isSignedIn, fetchChatHistory]);

  const saveMessage = async (message: MessageType) => {
    if (!userId) return;
    try {
      await axios.post("/api/chat-history", { userId, message });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const sendMessage = async (text: string, audio?: Blob) => {
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

      const response = await fetch("/api/assistants/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send message. HTTP status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseData.content },
      ]);
      await saveMessage({ role: "assistant", content: responseData.content });
    } catch (error) {
      console.error("Error while sending message:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setInputDisabled(false);
      setIsLoading(false);
    }
  };

  const handleUserInput = async () => {
    if (userInput.trim() || audioBlob) {
      const userMessage: MessageType = audioBlob
        ? { role: "user", content: "Audio message" }
        : { role: "user", content: userInput.trim() };

      setMessages((prev) => [...prev, userMessage]);
      await saveMessage(userMessage);

      if (audioBlob) {
        await sendMessage("", audioBlob);
        setAudioBlob(null);
      } else {
        await sendMessage(userInput.trim());
      }

      setUserInput("");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      toast.error("Failed to start recording.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        setAudioBlob(blob || null);
        setIsRecording(false);
        setRecordingStatus("Recording stopped");
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden">
        {/* Recording Status */}
        <div className="bg-yellow-100 text-yellow-800 text-sm font-medium p-2 text-center">
          🎤 Recording Status: {recordingStatus}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-lg mt-4 px-4 py-2 space-y-4">
          <MessageRenderer messages={messages} />
        </div>

        {/* Input Section */}
        <div className="mt-4 bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            {/* Input Field */}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={inputDisabled}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            {/* Send Button */}
            <button
              onClick={handleUserInput}
              disabled={inputDisabled || (!userInput.trim() && !audioBlob)}
              className={`px-4 py-2 rounded-lg font-medium text-sm shadow-md ${
                inputDisabled || (!userInput.trim() && !audioBlob)
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>

          {/* Error Message */}
          {streamError && (
            <div className="mt-2 text-sm text-red-500 text-center">
              <p>Error: {streamError}</p>
            </div>
          )}

          {/* Additional Controls */}
          <div className="mt-4 flex justify-between items-center">
            {/* Recording Toggle */}
            <button
              onClick={toggleRecording}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm shadow-md ${
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isRecording ? (
                <>
                  <FaMicrophoneSlash />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <FaMicrophone />
                  <span>Start Recording</span>
                </>
              )}
            </button>

            {/* Speech Toggle & Voice Selector */}
            <div className="flex items-center space-x-4">
              <button
                //onClick={toggleSpeech}
                className={`px-4 py-2 rounded-lg font-medium text-sm shadow-md ${
                  isSpeechEnabled
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {isSpeechEnabled ? "Speech On" : "Speech Off"}
              </button>
              {isSpeechEnabled && (
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onVoiceChange={setSelectedVoice}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSceneContent;
