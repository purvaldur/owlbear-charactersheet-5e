import 'dotenv/config';
import { io } from "socket.io-client";

const token = process.env.SOCKET_TOKEN

const socket = io("https://owlbear.vald.io", {})

socket.on("connect", () => {
  console.log("connected")
  socket.emit("data_auth", { token: token })
})

socket.on("auth", () => {
  console.log("authenticated")
  socket.emit("data", { token: token })
})

socket.on("data", (data) => {
  console.log(data)
})

socket.on('roll', (data) => {
  console.log(data)
})