import { useState } from "react";
import MessageList from "./MessageList";
import { useSocket } from "../../hooks/useSocket";

const ChatWindow = ({ username, onLogout }) => {
  const [inputValue, setInputValue] = useState("");
  const { messages, users, typingUsers, systemEvents, sendMessage, handleTyping, isConnected } =
    useSocket(username);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  };

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2># general</h2>
          <span className={`connection-dot ${isConnected ? "connected" : "disconnected"}`} />
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Online — {users.length}</p>
          <ul className="user-list">
            {users.map((u) => (
              <li key={u} className={`user-item ${u === username ? "user-self" : ""}`}>
                <span className="user-dot" />
                {u} {u === username && <span className="you-badge">you</span>}
              </li>
            ))}
          </ul>
        </div>

        <button className="btn-logout" onClick={onLogout}>
          Leave room
        </button>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1 className="chat-title">General Room</h1>
            <p className="chat-subtitle">
              {isConnected ? `${users.length} member${users.length !== 1 ? "s" : ""} online` : "Reconnecting…"}
            </p>
          </div>
          <span className="username-chip">{username}</span>
        </header>

        <MessageList
          messages={messages}
          typingUsers={typingUsers}
          systemEvents={systemEvents}
          currentUsername={username}
        />

        <form className="input-bar" onSubmit={handleSend}>
          <input
            type="text"
            className="message-input"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type a message…" : "Connecting…"}
            disabled={!isConnected}
            maxLength={1000}
            autoFocus
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!inputValue.trim() || !isConnected}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatWindow;
