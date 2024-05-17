import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { Server } from "socket.io";
import * as appwrite from './appwrite.js'

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
        socket.on('identify', (client) => {
          socket.join(client.room)
          appwrite.getUser(client.id).then((response) => {
            // console.log(response);
            if (response.total === 0) {
              socket.emit('characters', null)
            } else if (response.total === 1) {
              socket.emit('characters', response.documents[0].characters)
            }
          })
        })
        socket.on('create', (data) => {
          appwrite.createUser(data)
        })
        socket.on('update', (data) => {
          appwrite.updateUser(data)
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
