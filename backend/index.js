import express from "express";
import { Server as socketio } from "socket.io";
import http from "http";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);

const io = new socketio(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static frontend files
app.use(express.static(join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../frontend/index.html"));
});

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // Example: Emit a message to the client
  socket.on("connect-user", (coords) => {
    socket.emit("user-receiver", { id: socket.id, coords });
  });

  socket.on('disconnect', () => {
    io.emit("user-disconnected", () => {
      return socket.id;
    })
  });
});

app.use(cors({
  credentials: true,
  origin: "*"
}))

server.listen("3000", () => {
  console.log("Server running successfully");
});