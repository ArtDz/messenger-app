import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { HOST } from '@/utils/constants'
import { useAppStore } from '@/store'

export const SocketManager = () => {
  const userInfo = useAppStore(state => state.userInfo)
  const updateChannelPosition = useAppStore(state => state.updateChannelPosition)
  const updateDMContactPosition = useAppStore(state => state.updateDMContactPosition)
  const setSocket = useAppStore(state => state.setSocket)

  useEffect(() => {
    if (!userInfo) return

    const socket: Socket = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo._id }
    })

    console.log('initial socket', socket)

    setSocket(socket)

    socket.on('connect', () => {
      console.log('✅ Connected to socket server:', socket.id)
    })

    const handleReceiveMessage = (message: ReceivedMessage) => {
      const {
        selectedChatData,
        selectedChatType,
        addMessage,
      } = useAppStore.getState()

      console.log('Received message:',message)

      const isCurrentChat =
        selectedChatType === 'contact' &&
        (selectedChatData?._id === message.sender._id ||
          selectedChatData?._id === message.recipient?._id)

      if (isCurrentChat) {
        console.log('📩 Received message:', message)
        addMessage(message)
        updateDMContactPosition(message)
      }
    }

    const handleReceiveChannelMessage = (message: ReceivedChannelMessage) => {
      const {
        selectedChatData,
        selectedChatType,
        addMessage,
      } = useAppStore.getState()

      console.log('Received channel message:',message)

      const isCurrentChannel =
        selectedChatType === 'channel' &&
        (selectedChatData?._id === message.channelId)

      if (isCurrentChannel) {
        console.log('📩 Received channel message:', message)
        addMessage(message as unknown as StoredMessage<'channel'>)
        updateChannelPosition(message)
      }
    }

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
    })



    socket.on('receive-channel-message', handleReceiveChannelMessage)
    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      console.log('🛑 Disconnecting socket...')
      socket.disconnect()
    }
  }, [userInfo])

  return null
}
