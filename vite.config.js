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
          io.to(data.room).emit('roll', data.roll)
          io.to('data').emit('roll', data)
        })
        socket.on('data_auth', (data) => {
          if (data.token === process.env.SOCKET_TOKEN) {
            socket.join('data')
            socket.emit('auth')
          }
        })
        socket.on('data', (data) => {
          if (data.token === process.env.SOCKET_TOKEN) {
            let payload = {
              activeClientConnections: null,
              activeRooms: []
            }

            payload.activeClientConnections = io.engine.clientsCount
            io.sockets.adapter.rooms.forEach((value, key, map) => {
              // if not 'data' or on the list of sockets
              if (key !== 'data' && !Array.from(io.sockets.sockets.keys()).includes(key)) {
                payload.activeRooms.push({
                  name: key,
                  connections: value.size
                })
              }
            })

            console.log(payload);
            socket.emit('data', payload)
          }
        })
      })
    }
  }],
  server: {
      port: 3000,
      host: true
  }
})
