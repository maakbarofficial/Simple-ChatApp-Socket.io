import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 3000;

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  console.log("Id: ", socket.id);

  //   socket.emit("welcome", `Welcome to the server ${socket.id}`);
  //   socket.broadcast.emit("welcome", `${socket.id} join the server`); // e.g. User has join

  // usually we do emit from frontend not like above

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    // io.emit("recieve-message", data);00
    // socket.broadcast.emit("recieve-message", data);
    // io.to(room).emit("recieve-message", message);
    socket.to(room).emit("recieve-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
