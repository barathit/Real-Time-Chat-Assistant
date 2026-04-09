const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const { room = "general", limit = 50 } = req.query;
    const parsedLimit = Math.min(parseInt(limit, 10) || 50, 100);

    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .lean();

    res.json(messages.reverse());
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const saveMessage = async ({ username, text, room = "general", clientId }) => {
  const message = new Message({ username, text, room, clientId });
  return await message.save();
};

module.exports = { getMessages, saveMessage };
