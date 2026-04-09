const { saveMessage } = require("../controllers/messageController");

const roomUsers = {};

const getRoomUserList = (room) =>
  roomUsers[room] ? [...roomUsers[room].values()] : [];

const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("join_room", ({ username, room = "general" }) => {
      if (!username || typeof username !== "string") {
        return socket.emit("error", { message: "Invalid username" });
      }

      const trimmed = username.trim().slice(0, 30);

      if (!roomUsers[room]) roomUsers[room] = new Map();
      roomUsers[room].set(socket.id, trimmed);

      socket.join(room);
      socket.data.username = trimmed;
      socket.data.room = room;

      console.log(`👤 ${trimmed} joined room: ${room}`);

      socket.to(room).emit("user_joined", {
        username: trimmed,
        users: getRoomUserList(room),
        timestamp: new Date().toISOString(),
      });

      socket.emit("room_users", { users: getRoomUserList(room) });
    });

    socket.on("send_message", async ({ username, text, room = "general" }) => {
      if (!username || !text || typeof text !== "string") return;

      const trimmedText = text.trim().slice(0, 1000);
      if (!trimmedText) return;

      try {
        const saved = await saveMessage({
          username: username.trim(),
          text: trimmedText,
          room,
          clientId: socket.id,
        });

        const payload = {
          _id: saved._id,
          username: saved.username,
          text: saved.text,
          room: saved.room,
          clientId: saved.clientId,
          createdAt: saved.createdAt,
        };

        io.to(room).emit("receive_message", payload);
      } catch (err) {
        console.error("save message error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing", ({ username, room = "general" }) => {
      socket.to(room).emit("typing", { username });
    });

    socket.on("stop_typing", ({ username, room = "general" }) => {
      socket.to(room).emit("stop_typing", { username });
    });

    socket.on("disconnect", (reason) => {
      const { username, room } = socket.data;
      console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);

      if (username && room && roomUsers[room]) {
        roomUsers[room].delete(socket.id);
        if (roomUsers[room].size === 0) delete roomUsers[room];

        io.to(room).emit("user_left", {
          username,
          users: getRoomUserList(room),
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
};

module.exports = registerSocketHandlers;
