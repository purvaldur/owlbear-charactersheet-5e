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
      // console.log(io);
      io.on("connection", (socket) => {
        console.log(`connect ${socket.id}`);
        socket.on("disconnect", () => {
          console.log("disconnect");
        })
      })
    }
  }],
})
