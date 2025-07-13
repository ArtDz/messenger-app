import type {StateCreator} from 'zustand/vanilla'

type State = {
  selectedChatType?: ChatType
  selectedChatData?: User | Contact | Channel
  selectedChatMessages: StoredMessage<'channel'>[] | StoredMessage<'contact'>[]
  directMessagesContacts: Contact[]
  isFileUploading: boolean
  isFileDownloading: boolean
  fileUploadProgress: number
  fileDownloadProgress: number
  channels: Channel[]
}

type Actions = {
  setSelectedChatType: (selectedChatType?: ChatType) => void
  setSelectedChatData: (selectedChatData?: User | Contact | Channel) => void
  setSelectedChatMessages: (selectedChatMessages: StoredMessage<'channel'>[] | StoredMessage<'contact'>[]) => void
  setDirectMessagesContacts: (directMessagesContacts: Contact[]) => void
  setIsFileUploading: (isFileUploading: boolean) => void
  setIsFileDownloading: (isFileDownloading: boolean) => void
  setFileUploadProgress: (fileUploadProgress: number) => void
  setFileDownloadProgress: (fileDownloadProgress: number) => void
  setChannels: (channels: Channel[]) => void
  addChannel: (channel: Channel) => void
  updateChannelPosition: (message: ReceivedChannelMessage) => void
  updateDMContactPosition: (message: ReceivedMessage) => void
  addMessage: (message: StoredMessage<'channel'> | StoredMessage<'contact'>) => void
  closeChat: () => void
}

export type ChatSlice = State & Actions

export const createChatSlice: StateCreator<
  ChatSlice,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isFileUploading: false,
  isFileDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
  setIsFileUploading: (isFileUploading) => set({isFileUploading}),
  setIsFileDownloading: (isFileDownloading) => set({isFileDownloading}),
  setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
  setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
  setChannels: (channels) => set({channels}),
  updateChannelPosition: (message) => {
    const channels = get().channels
    const index = channels.findIndex(channel => channel._id === message.channelId)

    if (index === -1) return

    const updated = [...channels]
    const [channelToMove] = updated.splice(index, 1)
    updated.unshift(channelToMove)

    set({ channels: updated })
  },
  updateDMContactPosition: (message) => {
    const contacts = get().directMessagesContacts
    const index = contacts.findIndex(contact => contact._id === message.sender._id || contact._id === message.recipient._id)

    if (index === -1) return

    const updated = [...contacts]
    const [contactToMove] = updated.splice(index, 1)

    updated.unshift(contactToMove)

    set({ directMessagesContacts: updated })
  },
  addChannel: (channel) => set({channels: [...get().channels, channel]}),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages
    const selectedChatType = get().selectedChatType
    if (!selectedChatType) return;

    // @ts-ignore
    set({ selectedChatMessages: [
      ...(selectedChatMessages), {
      ...message,
          recipient: selectedChatType === 'channel'
            ? message.sender
            : (message.sender as User)?._id,
          sender: selectedChatType === 'channel'
            ? message.sender
            : (message.sender as User)?._id,
        }
      ] })
  },
  closeChat: () => set({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: []
  }),
});
