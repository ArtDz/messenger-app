type UserID = string
type MessageID = string
type ChannelID = string
type MessageType = 'text' | 'file'
type ChatType = 'contact' | 'channel'

interface User {
  _id: UserID
  email: string
  firstName?: string
  image?: string | null
  color?: number
  profileSetup: boolean
}

interface Contact {
  _id: UserID
  email: string
  firstName?: string
  image?: string | null
  color: number
  lastMessageTime: string
}

interface Channel {
  _id: string
  name: string
  members: UserID[]
  admin: UserID
  messages: MessageID[]
  createdAt: Date
  updatedAt: Date
}

interface ReceivedMessage {
  _id: string
  sender: User
  recipient: User
  messageType: MessageType
  content?: string
  timestamp: Date
}

interface ReceivedChannelMessage {
  _id: string
  channelId: ChannelID
  sender: User
  recipient: null
  messageType: MessageType
  content?: string
  timestamp: Date
}

interface StoredMessage<T extends ChatType> {
  _id: string
  sender: T extends 'contact' ? UserID : User
  recipient: T extends 'contact' ? UserID : User
  messageType: MessageType
  content?: string
  fileUrl?: string
  timestamp: Date
}

interface SendingContactMessage {
  sender: UserID
  recipient?: UserID
  messageType: MessageType
  content?: string
  fileUrl?: string
}

interface SendingChannelMessage {
  sender: UserID
  messageType: MessageType
  content?: string
  fileUrl?: string
  channelId: ChannelID
}

declare module 'react-lottie'

