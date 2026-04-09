import { useEffect, useRef, useState, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext";

const ROOM = "general";
const TYPING_DEBOUNCE_MS = 1500;

export const useSocket = (username) => {
  const { socket, isConnected } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [systemEvents, setSystemEvents] = useState([]);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/messages?room=${ROOM}&limit=50`);
        const data = await res.json();
        setMessages(data.map((m) => ({ ...m, isHistory: true })));
      } catch {
        console.warn("Could not load message history");
      }
    };
    if (username) fetchHistory();
  }, [username]);

  useEffect(() => {
    if (!socket || !username || !isConnected) return;

    socket.emit("join_room", { username, room: ROOM });

    const onReceiveMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => String(m._id) === String(msg._id))) return prev;
        return [...prev, msg];
      });
    };

    const onRoomUsers = ({ users: list }) => setUsers(list);

    const onUserJoined = ({ username: u, users: list, timestamp }) => {
      setUsers(list);
      setSystemEvents((prev) => [...prev, { type: "join", username: u, timestamp }]);
    };

    const onUserLeft = ({ username: u, users: list, timestamp }) => {
      setUsers(list);
      setSystemEvents((prev) => [...prev, { type: "leave", username: u, timestamp }]);
    };

    const onTyping = ({ username: u }) => {
      setTypingUsers((prev) => (prev.includes(u) ? prev : [...prev, u]));
    };

    const onStopTyping = ({ username: u }) => {
      setTypingUsers((prev) => prev.filter((x) => x !== u));
    };

    socket.on("receive_message", onReceiveMessage);
    socket.on("room_users", onRoomUsers);
    socket.on("user_joined", onUserJoined);
    socket.on("user_left", onUserLeft);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);

    return () => {
      socket.off("receive_message", onReceiveMessage);
      socket.off("room_users", onRoomUsers);
      socket.off("user_joined", onUserJoined);
      socket.off("user_left", onUserLeft);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
    };
  }, [socket, username, isConnected]);

  const sendMessage = useCallback(
    (text) => {
      if (!socket || !text.trim()) return;
      socket.emit("send_message", { username, text: text.trim(), room: ROOM });
      if (isTypingRef.current) {
        socket.emit("stop_typing", { username, room: ROOM });
        isTypingRef.current = false;
      }
    },
    [socket, username]
  );

  const handleTyping = useCallback(() => {
    if (!socket) return;

    if (!isTypingRef.current) {
      socket.emit("typing", { username, room: ROOM });
      isTypingRef.current = true;
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("stop_typing", { username, room: ROOM });
      isTypingRef.current = false;
    }, TYPING_DEBOUNCE_MS);
  }, [socket, username]);

  return {
    messages,
    users,
    typingUsers,
    systemEvents,
    sendMessage,
    handleTyping,
    isConnected,
  };
};
