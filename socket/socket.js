const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { messageService } = require("../services/message.service");

let io;
const userSocketMap = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware auth check
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      socket.userId = decode.userId || decode.id;
      return next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  // On connection
  io.on("connection", (socket) => {
    const userId = socket.userId.toString();
    console.log(`Socket connected: ${userId} -> ${socket.id}`);

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    // socket.broadcas.emit("userConnected", { userId: socket.id });
    socket.broadcast.emit("userConnected", { userId });


    userSocketMap.get(userId).add(socket.id);

    // Join personal room
    socket.join(userId);

    // Join conversation room
    socket.on("join conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Typing indicator
    socket.on("typing", ({ conversationId }) => {
      socket.to(conversationId).emit("typing", { conversationId, userId });
    });

    socket.on("stop typing", ({ conversationId }) => {
      socket.to(conversationId).emit("stop typing", { conversationId, userId });
    });

    // Mark as seen
    socket.on("markSeen", async ({ conversationId, messageIds }) => {
      try {
        await messageService.markSeen({ conversationId, userId, messageIds });
        io.to(conversationId).emit("messagesSeen", {
          conversationId,
          userId,
          messageIds,
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${userId} -> ${socket.id}`);
      if (userSocketMap.has(userId)) {
        userSocketMap.get(userId).delete(socket.id);
        if (userSocketMap.get(userId).size === 0) {
          userSocketMap.delete(userId);
          socket.broadcast.emit("userDisconnected", { userId });

        }
      }
    });
  });

  console.log(" Socket.IO initialized");
};

const getIo = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIo, userSocketMap };
