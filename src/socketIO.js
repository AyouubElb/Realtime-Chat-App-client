import { io } from "socket.io-client";

export function connect() {
  // Connect to the Socket.IO server
  let socket = io("http://localhost:3000"); // Replace with your server URL
  socket.on("connect", () => {
    // console.log("server is connected ", this.socket.id);
  });

  return socket;
}
