import { Manager, Socket } from 'socket.io-client'

const manager = new Manager(import.meta.env.VITE_API_HOST, { autoConnect: false })

export const socket = manager.socket('/', {})

export const socketSetup = (socket: Socket) => {
  socket.on('connect', () => {
    console.log('Connected to server', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })
}
