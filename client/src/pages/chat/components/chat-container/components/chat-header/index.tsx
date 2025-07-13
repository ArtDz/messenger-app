import {RiCloseFill} from 'react-icons/ri'
import {useAppStore} from '@/store'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar.tsx'
import {HOST} from '@/utils/constants.ts'
import {getColor} from '@/lib/utils.ts'

export const ChatHeader = () => {
  const closeChat = useAppStore(state => state.closeChat)
  const selectedChatData = useAppStore(state => state.selectedChatData)
  const selectedChatType = useAppStore(state => state.selectedChatType)

  return (
    <section className='h-[10vh] border-b-2 border-[#2f303b] flex-between px-8'>
      <div className='flex-between gap-5 w-full'>
        <div className='flex-center gap-3'>
          <div className="w-12 h-12 relative">
            {selectedChatType === 'contact'
              ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                <AvatarImage src={`${HOST}/${(selectedChatData as Contact)?.image}` as string} alt="profile image"
                             className="object-cover h-full w-full bg-full"/>
                <AvatarFallback
                  className={`${getColor((selectedChatData as Contact)?.color || 0)} uppercase h-12 w-12 text-lg border-[1px] flex-center`}>
                  {(selectedChatData as Contact)?.firstName ? (selectedChatData as Contact)?.firstName?.[0] : '?'}
                </AvatarFallback>
              </Avatar>
            )
              : <div className="bg-[#ffffff22] h-10 w-10 flex-center rounded-full">#</div>
            }
          </div>
          {selectedChatType === 'contact' && <span>{(selectedChatData as Contact)?.firstName}</span>}
          {selectedChatType === 'channel' && <span>{(selectedChatData as Channel)?.name}</span>}
        </div>
        <div className='flex-center gap-5'>
          <button onClick={closeChat} className='text-neutral-500 hover:text-white cursor-pointer focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
            <RiCloseFill className='text-3xl'/>
          </button>
        </div>
      </div>
    </section>
  )
}
