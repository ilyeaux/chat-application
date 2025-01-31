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

  // Listen for the 'set username' event
  socket.on("set username", (username) => {
    socket.username = username; // Store the username in the socket object
    console.log(`${username} has joined the chat`);
    io.emit("chat message", {
      username: "System",
      message: `${username} has joined the chat`,
    });
  });

  // Listen for the 'chat message' event
  socket.on("chat message", (msg) => {
    console.log("Received message:", msg); // Log received messages
    io.emit("chat message", { username: socket.username, message: msg }); // Broadcast the message with the username
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      console.log(`${socket.username} has left the chat`);
      io.emit("chat message", {
        username: "System",
        message: `${socket.username} has left the chat`,
      });
    } else {
      console.log("A client has disconnected");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
