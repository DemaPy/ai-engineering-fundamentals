import { useState } from "react";
import type { UIMessage } from "ai";
import MessageList from "./MessageList";
import "./chat.css";

interface ChatPanelProps {
  messages: UIMessage[];
  sendMessage: (message: { role: "user"; parts: { type: "text"; text: string }[] }) => void;
  status: string;
}

export default function ChatPanel({
  messages,
  sendMessage,
  status,
}: ChatPanelProps) {

  return (
    <div className="chat-panel">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput sendMessage={sendMessage} status={status} />
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="chat-header">
      <h2>Chat</h2>
    </div>
  );
}

function ChatInput({ sendMessage, status }: { sendMessage: (message: { role: "user"; parts: { type: "text"; text: string }[] }) => void; status: string }) {
  const [input, setInput] = useState("");
  const isStreaming = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="Describe a diagram..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isStreaming}
      />
    </form>
  );
}