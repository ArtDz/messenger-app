import {type ChangeEvent, useRef, useState} from 'react'
import {GrAttachment} from 'react-icons/gr'
import {RiEmojiStickerLine} from 'react-icons/ri'
import {IoSend} from 'react-icons/io5'
import EmojiPicker, {Theme} from 'emoji-picker-react'
import {useCloseEmojiPicker} from '@/pages/chat/hooks/useCloseEmojiPicker.ts'
import {useAppStore} from '@/store'
import {apiClient} from '@/lib/api-client.ts'
import {uploadFileRoute} from '@/utils/constants.ts'
import type {AxiosResponse} from 'axios'

export const MessageBar = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const userInfo = useAppStore(state => state.userInfo)
  const socket = useAppStore(state => state.socket)
  const selectedChatType = useAppStore(state => state.selectedChatType)
  const selectedChatData = useAppStore(state => state.selectedChatData)
  const setIsFileUploading = useAppStore(state => state.setIsFileUploading)
  const setFileUploadProgress = useAppStore(state => state.setFileUploadProgress)

  const [message, setMessage] = useState('')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const emojiRef = useRef<HTMLDivElement | null>(null);

  useCloseEmojiPicker(emojiRef, setEmojiPickerOpen)

  const addEmoji = (emoji: {emoji : string}) => {
    setMessage(prev => prev + emoji.emoji)
  }

  const sendMessage = async () => {
    if (!message) return
    if (selectedChatType === 'contact') {
      const messageToSend: SendingContactMessage = {
        sender: userInfo?._id || '',
        content: message,
        recipient: selectedChatData?._id,
        messageType: 'text',
        fileUrl: undefined
      }
      socket?.emit('sendMessage', messageToSend)
    } else if (selectedChatType === 'channel'){
      const messageToSend: SendingChannelMessage = {
        sender: userInfo?._id || '',
        content: message,
        messageType: 'text',
        fileUrl: undefined,
        channelId: selectedChatData!._id,
      }
      socket?.emit('send-channel-message', messageToSend)
    }
    setMessage('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleAttachmentChange = async (event:ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target?.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        setIsFileUploading(true)
        const response = await apiClient.post(uploadFileRoute, formData,
          {
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
              setFileUploadProgress(progress)
              if (progress === 100) {
                setFileUploadProgress(0)
                setIsFileUploading(false)
              }
            }
          }
        ) as AxiosResponse<{filePath: string}>

        if (response.status === 200 && response.data.filePath) {
          if (selectedChatType === 'contact') {
            setIsFileUploading(false)
            const messageToSend: SendingContactMessage = {
              sender: userInfo?._id || '',
              content: undefined,
              recipient: selectedChatData?._id,
              messageType: 'file',
              fileUrl: response.data.filePath
            }
            socket?.emit('sendMessage', messageToSend)
          } else if (selectedChatType === 'channel'){
            setIsFileUploading(false)
            const messageToSend: SendingChannelMessage = {
              sender: userInfo?._id || '',
              content: undefined,
              messageType: 'file',
              fileUrl: response.data.filePath,
              channelId: selectedChatData!._id,
            }
            socket?.emit('send-channel-message', messageToSend)
          }
          setMessage('')
        }

      }
    } catch (error) {
      setIsFileUploading(false)
      console.log(error)
    }
  }

  return (
    <section className='h-[10vh] bg-[#1c1d25] flex-center px-8 mb-6 gap-6'>
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
          placeholder='Enter message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className='cursor-pointer text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
          <GrAttachment onClick={handleAttachmentClick} className='text-2xl'/>
        </button>
        <input type='file' ref={fileInputRef} className='hidden' onChange={(e) => handleAttachmentChange(e)}/>

        <div className="relative">
          <button onClick={() => setEmojiPickerOpen(true)} className='cursor-pointer text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
            <RiEmojiStickerLine className='text-2xl'/>
          </button>
          <div ref={emojiRef} className='absolute bottom-16 right-0'>
            <EmojiPicker
              onEmojiClick={addEmoji}
              theme={Theme.DARK}
              open={emojiPickerOpen}
              lazyLoadEmojis
            />
          </div>
        </div>
      </div>
      <button onClick={sendMessage} className='bg-[#8417ff] hover:bg-[#741bda] rounded-md flex-center p-5 cursor-pointer focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
        <IoSend className='text-2xl'/>
      </button>
    </section>
  )
}
