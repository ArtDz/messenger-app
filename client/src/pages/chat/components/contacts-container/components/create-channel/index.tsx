import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip'
import {FaPlus} from 'react-icons/fa'
import {useEffect, useState} from 'react'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input.tsx'
import {createChannelRoute, getAllContactsRoute} from '@/utils/constants.ts'
import {apiClient} from '@/lib/api-client.ts'
import type {AxiosResponse} from 'axios'
import {useAppStore} from '@/store'
import {Button} from '@/components/ui/button.tsx'
import MultipleSelector, {type Option} from '@/components/ui/multiselect.tsx'
import {toast} from 'sonner'

export const CreateChannel = () => {
  const setSelectedChatType = useAppStore(state => state.setSelectedChatType)
  const setSelectedChatData = useAppStore(state => state.setSelectedChatData)
  const addChannel = useAppStore(state => state.addChannel)

  const [openNewChannelModal, setOpenNewChannelModal] = useState(false)
  const [allContacts, setAllContacts] = useState<{label: string, value: string}[] | []>([])
  const [selectedContacts, setSelectedContacts] = useState<{label: string, value: string}[] | []>([])
  const [channelName, setChannelName] = useState('')

  useEffect(() => {
    const getAllContacts = async () => {
      const response = await apiClient.get(getAllContactsRoute, {
        withCredentials: true
      }) as AxiosResponse<{contacts: {label: string, value: string}[]}>
      setAllContacts(response.data.contacts)
    }
    getAllContacts()
  }, []);

  const createChannel = async () => {
    if (!channelName) {
      toast.error('Channel name is required')
      return
    }

    if (selectedContacts.length <= 0) {
      toast.error('Channel name is required')
      return
    }

    try {
      const response = await apiClient.post(createChannelRoute, {
        name: channelName,
        members: selectedContacts.map(contact => contact.value)
      }, {withCredentials: true})
      if (response.status === 201) {
        setChannelName('')
        addChannel(response.data.channel)
        setOpenNewChannelModal(false)
        setSelectedChatType('channel')
        setSelectedChatData(response.data.channel)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            onClick={() => setOpenNewChannelModal(true)}
            className='text-neutral-400/90 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'/>
        </TooltipTrigger>
        <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3'>
          Create New Channel
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
        <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
          <DialogHeader>
            <DialogTitle>Fill up the details for new channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel name"
              className='rounded-lg p-6 bg-[#2c2e3b] border-none outline-none'
              onChange={event => setChannelName(event.target.value)}
            />
          </div>
          <MultipleSelector
            className='rounded-lg bg-[#2c2e3b] border-none outline-none py-2 text-white'
            defaultOptions={allContacts}
            placeholder='Search Contacts'
            value={selectedContacts}
            onChange={setSelectedContacts as (options: Option[]) => void}
            emptyIndicator={(() => (<p className='text-center text-lg leading-10 text-gray-600'>No Results Found</p>))()}
          />
            <Button
              className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
              onClick={createChannel}
            >Create Channel</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
