import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Server } from "socket.io";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),{
    name: 'socket-io',
    configureServer({httpServer}) {
      const io = new Server(httpServer, {
        cors: {
          origin: "*"
        }
      })
      io.on("connection", (socket) => {
        socket.on('join', (room) => {
          // console.log(room);
          socket.join(room)
        })
        socket.on('roll', (data) => {
          // console.log(data);
          // console.log(data.room);
          io.to(data.room).emit('roll', data.roll)
        })
      })
    }
  }],
  server: {
      port: 3000,
      host: true
  }
})
