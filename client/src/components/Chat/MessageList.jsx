import { useEffect, useRef } from "react";
import MessageBubble from "../UI/MessageBubble";
import TypingIndicator from "../UI/TypingIndicator";
import { formatDate, shouldShowDateDivider } from "../../utils/formatTime";

const SystemEvent = ({ event }) => (
  <div className="system-event">
    <span>
      {event.type === "join" ? "👋" : "🚪"} {event.username}{" "}
      {event.type === "join" ? "joined" : "left"} the room
    </span>
  </div>
);

const DateDivider = ({ date }) => (
  <div className="date-divider">
    <span>{date}</span>
  </div>
);

const MessageList = ({ messages, typingUsers, systemEvents, currentUsername }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <div className="empty-state">
          <p>No messages yet. Say hello! 👋</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={msg._id || index}>
          {shouldShowDateDivider(messages, index) && (
            <DateDivider date={formatDate(msg.createdAt)} />
          )}
          <MessageBubble
            message={msg}
            isOwn={msg.username === currentUsername}
          />
        </div>
      ))}

      {systemEvents.slice(-3).map((ev, i) => (
        <SystemEvent key={i} event={ev} />
      ))}

      <TypingIndicator typingUsers={typingUsers} />

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
