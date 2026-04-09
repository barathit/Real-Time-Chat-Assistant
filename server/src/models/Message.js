const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    room: {
      type: String,
      default: "general",
      trim: true,
    },
    clientId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
