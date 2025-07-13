import type {StateCreator} from 'zustand/vanilla'
import type {Socket} from 'socket.io-client'

type State = {
  socket: Socket | null
}

type Actions = {
  setSocket: (socket: Socket | null) => void
}

export type SocketSlice = State & Actions

export const createSocketSlice: StateCreator<
  SocketSlice,
  [],
  [],
  SocketSlice
> = (set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
});
