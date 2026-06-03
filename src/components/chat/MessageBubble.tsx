import type { UIDataTypes, UIMessage, UIMessagePart, UITools } from "ai";
import MarkdownRenderer from "./MarkdownRenderer";
import ToolStatus from "../streaming/ToolStatus";
import "../streaming/streaming.css";

interface MessageBubbleProps {
  message: UIMessage;
}

const PART_TYPES = {
  text: {
    component: TextPart,
    type: "text",
  },
  tool: {
    component: ToolPart,
    type: "tool",
  },
} as const;

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message-bubble ${message.role}`}>
      <RoleBadge role={message.role} />
      <div className="message-content">
        {message.parts?.map((part, i) => {
          const partType = PART_TYPES[part.type as keyof typeof PART_TYPES];
          if (!partType) {
            return null;
          }
          const Component = partType.component;
          return <Component key={i} message={message} part={part} i={i} />;
        })}
      </div>
    </div>
  );
}

function ToolPart({ part, i }: { part: UIMessagePart<UIDataTypes, UITools>; i: number }) {
  if (!part.type?.startsWith("tool-")) {
    return null;
  }

  const toolName = part.type.replace("tool-", "");
  const toolPart = part as { state?: string };
  const status =
    toolPart.state === "output-available"
      ? "complete"
      : toolPart.state === "output-error"
        ? "error"
        : "running";
      
  return <ToolStatus key={i} name={toolName} status={status} />;
}

function TextPart({ message, part, i }: { message: UIMessage; part: UIMessagePart<UIDataTypes, UITools>; i: number }) {
  if (part.type !== "text") {
    return null;
  }

  if (message.role === "assistant") {
    return <MarkdownRenderer key={i} content={part.text} />;
  }

  return <p key={i}>{part.text}</p>;
}

function RoleBadge({ role }: { role: "system" | "user" | "assistant" }) {
  return (
    <div className="message-role">
      {role === "user" ? "You" : "Assistant"}
    </div>
  );
}