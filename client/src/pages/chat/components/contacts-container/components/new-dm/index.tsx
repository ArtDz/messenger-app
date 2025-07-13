import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {FaPlus} from 'react-icons/fa'
import {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from '@/components/ui/input.tsx'
import Lottie from 'react-lottie'
import {animationDefaultOptions, getColor} from '@/lib/utils.ts'
import {HOST, searchContactsRoute} from '@/utils/constants.ts'
import {apiClient} from '@/lib/api-client.ts'
import type {AxiosResponse} from 'axios'
import {ScrollArea} from '@/components/ui/scroll-area.tsx'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar.tsx'
import {useAppStore} from '@/store'

export const NewDm = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState<User[]>([])
  const setSelectedChatType = useAppStore(state => state.setSelectedChatType)
  const setSelectedChatData = useAppStore(state => state.setSelectedChatData)


  const searchContacts = async (searchTerm:string) => {
    if (!searchTerm) {
      setSearchedContacts([])
      return
    }

    try {
      const response = await apiClient.get(searchContactsRoute, {
        params: { searchTerm },
        withCredentials: true,
      }) as AxiosResponse<{contacts: User[]}>

      if (response.status === 200 && Array.isArray(response.data.contacts)) {
        setSearchedContacts(response.data.contacts)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  const selectNewContact = (contact: User) => {
    setOpenNewContactModal(false)
    setSearchedContacts([])
    setSelectedChatType('contact')
    setSelectedChatData(contact)
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            onClick={() => setOpenNewContactModal(true)}
            className='text-neutral-400/90 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'/>
        </TooltipTrigger>
        <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3'>
          Select New Contact
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
          <DialogHeader>
            <DialogTitle>Select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contact"
              className='rounded-lg p-6 bg-[#2c2e3b] border-none outline-none'
              onChange={event => searchContacts(event.target.value)}
            />
          </div>
          {!!searchedContacts.length && <ScrollArea className="h-[250px]">
            <ul className="flex flex-col gap-5">
              {
                searchedContacts.map((contact) => (
                  <li onClick={() => selectNewContact(contact)} className="flex gap-5 cursor-pointer" key={contact._id}>
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        <AvatarImage src={`${HOST}/${contact?.image}` as string} alt="profile image"
                                     className="object-cover h-full w-full bg-full"/>
                        <AvatarFallback
                          className={`${getColor(contact?.color || 0)} uppercase h-12 w-12 text-lg border-[1px] flex-center`}>
                          {contact?.firstName ? contact?.firstName[0] : '?'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-col flex">
                      <span>{contact.firstName}</span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </li>
                ))
              }
            </ul>
          </ScrollArea>}
          {!searchedContacts.length && (
            <section className="flex-1 mt-5 md:flex-center flex-col hidden duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className='text-white/80 font-light text-center flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300'>
                <h3 className='poppins-medium'>
                  Search new <span className='text-purple-500'>Contact.</span>
                </h3>
              </div>
            </section>
          ) }
        </DialogContent>
      </Dialog>
    </>
  )
}
