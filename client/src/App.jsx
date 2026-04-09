import { SocketProvider } from "./context/SocketContext";
import ChatPage from "./pages/ChatPage";
import "./index.css";

function App() {
  return (
    <SocketProvider>
      <ChatPage />
    </SocketProvider>
  );
}

export default App;
