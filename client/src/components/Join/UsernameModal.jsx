import { useState } from "react";

const UsernameModal = ({ onJoin }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return setError("Please enter a username");
    if (trimmed.length < 2) return setError("At least 2 characters required");
    if (trimmed.length > 30) return setError("Max 30 characters");
    onJoin(trimmed);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon">💬</div>
        <h1>Join the Chat</h1>
        <p className="modal-subtitle">Enter a username to get started</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="Your username..."
            autoFocus
            maxLength={30}
            className={`modal-input ${error ? "input-error" : ""}`}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary" disabled={!value.trim()}>
            Join Room →
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
