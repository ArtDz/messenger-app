import {ChatHeader} from '@/pages/chat/components/chat-container/components/chat-header'
import {MessageContainer} from '@/pages/chat/components/chat-container/components/message-container'
import {MessageBar} from '@/pages/chat/components/chat-container/components/message-bar'

const ChatContainer = () => {
  return (
    <section className='w-full bg-[#1c1d25] flex flex-col'>
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    </section>
  )
}

export default ChatContainer
