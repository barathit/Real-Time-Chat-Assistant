import { useState } from "react";
import UsernameModal from "../components/Join/UsernameModal";
import ChatWindow from "../components/Chat/ChatWindow";

const ChatPage = () => {
  const [username, setUsername] = useState(null);

  const handleJoin = (name) => setUsername(name);
  const handleLogout = () => setUsername(null);

  if (!username) {
    return <UsernameModal onJoin={handleJoin} />;
  }

  return <ChatWindow username={username} onLogout={handleLogout} />;
};

export default ChatPage;
