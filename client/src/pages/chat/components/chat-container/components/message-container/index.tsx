import {useAppStore} from '@/store'
import {useEffect, useRef, useState} from 'react'
import moment from 'moment'
import {isContactMessage} from '@/utils/isContactMessage.ts'
import {cn, getColor} from '@/lib/utils.ts'
import {apiClient} from '@/lib/api-client.ts'
import {getChannelMessagesRoute, getMessagesRoute, HOST} from '@/utils/constants.ts'
import type {AxiosResponse} from 'axios'
import {isFileImage} from '@/utils/isFileImage.ts'
import {MdFolderZip} from 'react-icons/md'
import {IoMdArrowRoundDown} from 'react-icons/io'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar.tsx'

export const MessageContainer = () => {
  const userInfo = useAppStore(state => state.userInfo)
  const selectedChatMessages = useAppStore(state => state.selectedChatMessages)
  const selectedChatType = useAppStore(state => state.selectedChatType)
  const selectedChatData = useAppStore(state => state.selectedChatData)
  const setSelectedChatMessages = useAppStore(state => state.setSelectedChatMessages)
  const setIsFileDownloading = useAppStore(state => state.setIsFileDownloading)
  const setFileDownloadProgress = useAppStore(state => state.setFileDownloadProgress)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.get(getMessagesRoute, {
          params: {recipient: selectedChatData?._id},
          withCredentials: true
        }) as AxiosResponse<{ messages: StoredMessage<'contact'>[] }>
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(getChannelMessagesRoute, {
          params: {channelId: selectedChatData?._id},
          withCredentials: true
        }) as AxiosResponse<{ messages: StoredMessage<'contact'>[] }>
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (selectedChatData?._id) {
      if (selectedChatType === 'contact') getMessages()
      if (selectedChatType === 'channel') getChannelMessages()
    }

  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [selectedChatMessages]);

  const downloadFile = async (fileUrl?: string) => {
    if (!fileUrl) return
    setIsFileDownloading(true)
    const response = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
      setFileDownloadProgress(progress)
      if (progress === 100) {
        setIsFileDownloading(false)
        setFileDownloadProgress(0)
      }
      }})
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = urlBlob
    link.setAttribute('download', fileUrl.split('/').pop() || '')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(urlBlob)
  }

  const renderDMMessages = (message: StoredMessage<'contact'>) => {
    return (
      <div className={cn(message.sender !== selectedChatData?._id ? 'text-right' : 'text-left')}>
        {message.messageType === 'text' && (
          <div className={cn(
            message?.sender !== selectedChatData?._id
              ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20',
            'border inline-block p-4 rounded my-1 max-w-[50%] break-words'
          )}>{message.content}</div>
        )}
        {message.messageType === 'file' && (
          <div className={cn(
            message?.sender !== selectedChatData?._id
              ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20',
            'border inline-block p-4 rounded my-1 max-w-[50%] break-words'
          )}>
            {
              message.fileUrl && isFileImage(message.fileUrl)
                ? (
                  <div className="cursor-pointer" onClick={() => {
                    setShowImage(true)
                    setImageUrl(message.fileUrl!)
                  }}>
                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300}/>
                  </div>
                )
                : (
                  <div className="flex-center gap-4">
                    <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                      <MdFolderZip/>
                    </span>
                    <span>{(message?.fileUrl || '').split('/').pop()}</span>
                    <span onClick={() => downloadFile(message.fileUrl)}
                          className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300">
                      <IoMdArrowRoundDown/>
                    </span>
                  </div>
                )
            }
          </div>
        )
        }
        <div className="text-xs text-gray-600">{moment(message.timestamp).format('LT')}</div>
      </div>
    )
  }

  const renderChannelMessages = (message: StoredMessage<'channel'>) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo?._id ? 'text-left' : 'text-right'}`}>
        {message.messageType === 'text' && (
          <div className={cn(
            message?.sender._id === userInfo?._id
              ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20',
            'border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9'
          )}>{message.content}</div>
        )}
        {message.messageType === 'file' && (
          <div className={cn(
            message.sender._id !== userInfo?._id
              ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
              : 'bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20',
            'border inline-block p-4 rounded my-1 max-w-[50%] break-words'
          )}>
            {
              message.fileUrl && isFileImage(message.fileUrl)
                ? (
                  <div className="cursor-pointer" onClick={() => {
                    setShowImage(true)
                    setImageUrl(message.fileUrl!)
                  }}>
                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300}/>
                  </div>
                )
                : (
                  <div className="flex-center gap-4">
                    <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                      <MdFolderZip/>
                    </span>
                    <span>{(message?.fileUrl || '').split('/').pop()}</span>
                    <span onClick={() => downloadFile(message.fileUrl)}
                          className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300">
                      <IoMdArrowRoundDown/>
                    </span>
                  </div>
                )
            }
          </div>
        )
        }
        {
          message.sender._id !== userInfo?._id ? (
            <div className='flex items-center justify-start gap-3'>
              <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                <AvatarImage src={`${HOST}/${message.sender.image}` as string} alt="profile image"
                             className="object-cover h-full w-full bg-full"/>
                <AvatarFallback
                  className={`${getColor(message.sender?.color || 0)} uppercase h-8 w-8 text-lg flex-center`}>
                  {message.sender?.firstName ? message.sender?.firstName?.[0] : '?'}
                </AvatarFallback>
              </Avatar>
              <span className='text-sm text-white/60'>{message.sender.firstName}</span>
              <span className='text-sm text-white/60'>{moment(message.timestamp).format('LT')}</span>
            </div>
          ) : (
            <div className='text-sm text-white/60 mt-1'>{moment(message.timestamp).format('LT')}</div>
          )
        }
      </div>
    )
  }

  const renderMessages = () => {
    let lastDate: string | null = null
    return selectedChatMessages.map((msg, index) => {
      const messageDate = moment(msg.timestamp).format('YYYY-MM-DD')
      const showDate = messageDate !== lastDate
      lastDate = messageDate
      return (
        <div key={msg._id} ref={index === selectedChatMessages.length - 1 ? scrollRef : null}>
          {showDate && <div className="text-center text-gray-500 my-2">{moment(msg.timestamp).format('LL')}</div>}
          {isContactMessage(msg) && selectedChatType === 'contact' && renderDMMessages(msg)}
          {selectedChatType === 'channel' && renderChannelMessages(msg as StoredMessage<'channel'>)}
        </div>)
    })
  }

  return (
    <section className="flex-1 overflow-y-auto p-4 px-8 w-full no-scrollbar">
      {renderMessages()}
      {showImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => {
            setShowImage(false)
            setImageUrl('')
          }}/>
          <img src={`${HOST}/${imageUrl}`} alt="image" className="max-h-[80vh] max-w-[80vw] z-51"/>
          <span
            onClick={() => downloadFile(imageUrl)}
            className="border absolute flex-center bottom-[25px] bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300"
          >
            <IoMdArrowRoundDown/>
          </span>
        </div>
      )}
    </section>
  )
}
