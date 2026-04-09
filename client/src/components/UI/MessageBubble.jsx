import { formatTime } from "../../utils/formatTime";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`message-wrapper ${isOwn ? "own" : "other"}`}>
      {!isOwn && <span className="message-username">{message.username}</span>}
      <div className={`bubble ${isOwn ? "bubble-own" : "bubble-other"}`}>
        <p className="bubble-text">{message.text}</p>
        <span className="bubble-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
