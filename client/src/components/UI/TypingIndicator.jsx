const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers.length) return null;

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : typingUsers.length === 2
      ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
      : "Several people are typing";

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>
      <span className="typing-label">{label}</span>
    </div>
  );
};

export default TypingIndicator;
