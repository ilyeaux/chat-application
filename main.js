import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// Allow any origin for CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("chat message", (msg) => {
    console.log("Received message:", msg); // Log received messages
    io.emit("chat message", msg); // Broadcast the message to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
