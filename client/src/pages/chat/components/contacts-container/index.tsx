import {Logo} from '@/components/Logo.tsx'
import {Title} from '@/components/Title.tsx'
import {ProfileInfo} from '@/pages/chat/components/contacts-container/components/profile-info'
import {NewDm} from '@/pages/chat/components/contacts-container/components/new-dm'
import {useAppStore} from '@/store'
import {ContactList} from '@/components/ContactList.tsx'
import {CreateChannel} from '@/pages/chat/components/contacts-container/components/create-channel'
import {useGetUserChannels} from '@/pages/chat/hooks/useGetUserChannels.ts'
import {useGetContactsDM} from '@/pages/chat/hooks/useGetContactsDM.ts'

const ContactContainer = () => {
  const directMessagesContacts = useAppStore(state => state.directMessagesContacts)
  const channels = useAppStore(state => state.channels)

  useGetContactsDM()
  useGetUserChannels()

  return (
    <section className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className='pt-3'>
        <Logo />
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-10'>
          <Title>Direct Messages</Title>
          <NewDm/>
        </div>
        <div className='max-h-[38vh] overflow-y-auto no-scrollbar'>
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className='my-5'>
        <div className='flex items-center justify-between pr-10'>
          <Title>Channels</Title>
          <CreateChannel/>
        </div>
        <div className='max-h-[38vh] overflow-y-auto no-scrollbar'>
          <ContactList contacts={channels} isChannel/>
        </div>
      </div>
      <ProfileInfo/>
    </section>
  )
}

export default ContactContainer
