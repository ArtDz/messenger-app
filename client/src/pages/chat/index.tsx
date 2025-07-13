import {useAppStore} from '@/store'
import {useNavigate} from 'react-router'
import {useEffect} from 'react'
import {toast} from 'sonner'
import {AppRoutes} from '@/routes/routes.ts'
import ContactsContainer from '@/pages/chat/components/contacts-container'
import ChatContainer from '@/pages/chat/components/chat-container'
import EmptyChatContainer from '@/pages/chat/components/empty-chat-container'
import {SocketManager} from '@/context/SocketManager.tsx'

const ChatPage = () => {
  const userInfo = useAppStore(state => state.userInfo)
  const isFileUploading = useAppStore(state => state.isFileUploading)
  const isFileDownloading = useAppStore(state => state.isFileDownloading)
  const fileUploadProgress = useAppStore(state => state.fileUploadProgress)
  const fileDownloadProgress = useAppStore(state => state.fileDownloadProgress)
  const selectedChatType = useAppStore(state => state.selectedChatType)
  const navigate = useNavigate()
  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast('Setup your profile to start chatting!')
      navigate(AppRoutes.Profile)
    }
  }, [navigate, userInfo]);

  return (
    <main className='flex h-[100vh] text-white overflow-hidden'>
      {isFileUploading &&
        <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uploading File</h5>
          {fileUploadProgress}%
        </div>
      }
      {isFileDownloading &&
        <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      }
      <SocketManager/>
      <ContactsContainer/>
      {selectedChatType === undefined
        ? <EmptyChatContainer/>
        : <ChatContainer/>}
    </main>
  )
}

export default ChatPage
