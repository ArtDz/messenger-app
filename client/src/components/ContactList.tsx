import {useAppStore} from '@/store'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar.tsx'
import {HOST} from '@/utils/constants.ts'
import {getColor} from '@/lib/utils.ts'

type ContactProps = {
  contacts: Contact[]
  isChannel?: false
}

type ChannelProps = {
  contacts: Channel[]
  isChannel: true
}

type Props = ContactProps | ChannelProps


export const ContactList = ({ contacts, isChannel = false }: Props) => {
  const selectedChatData = useAppStore(state => state.selectedChatData)
  const setSelectedChatType = useAppStore(state => state.setSelectedChatType)
  const setSelectedChatData = useAppStore(state => state.setSelectedChatData)
  const setSelectedChatMessages = useAppStore(state => state.setSelectedChatMessages)

  const handleClick = (contact: Contact | Channel) => {
    setSelectedChatType(isChannel? 'channel' : 'contact')
    setSelectedChatData(contact)

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([])
    }
  }

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          onClick={() => handleClick(contact)}
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id
            ? 'bg-[#8417ff] hover:bg-[#8417ff]'
            : 'hover:bg-[#f1f1f111]'
          }`}
        >
          <div className="flex items-center justify-start gap-5 text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {/* eslint-disable-next-line no-constant-binary-expression */}
                <AvatarImage src={`${HOST}/${(contact as Contact)?.image}` || ''} alt="profile image"
                             className="object-cover h-full w-full bg-full" />
                <AvatarFallback
                  className={`${getColor((contact as Contact)?.color || 0)} uppercase h-10 w-10 text-lg border-[1px] flex-center`}>
                  {(contact as Contact)?.firstName?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
            )}
            {isChannel
              ? <>
                <div className="bg-[#ffffff22] h-10 w-10 flex-center rounded-full"></div>
                <span>{(contact as Channel).name}</span>
              </>
              : <span>{(contact as Contact).firstName}</span>
            }
          </div>
        </div>
      ))}
    </div>
  )
}
