import {create} from 'zustand/react'
import {type AuthSlice, createAuthSlice} from '@/store/slices/auth-slice.ts'
import {type ChatSlice, createChatSlice} from '@/store/slices/chat-slice.ts'
import {createSocketSlice, type SocketSlice} from '@/store/slices/socket-slice.ts'

type AppStore = AuthSlice & ChatSlice & SocketSlice

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
  ...createSocketSlice(...a),
}))
