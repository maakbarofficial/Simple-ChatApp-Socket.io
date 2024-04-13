import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:3000/"), []);
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ App ~ messages:", messages);

  const [message, setMessage] = useState("");

  const [room, setRoom] = useState("");

  const [roomName, setRoomName] = useState("");

  const [socketID, setSocketID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected");
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("recieve-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />
      <Typography variant="h3" component="div" gutterBottom>
        Socket.io Walkthrough
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id="outlined-basic" label="Room Name" variant="outlined" />
        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />
        <TextField value={room} onChange={(e) => setRoom(e.target.value)} id="outlined-basic" label="Room" variant="outlined" />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
