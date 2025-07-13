import {useEffect} from 'react'
import {apiClient} from '@/lib/api-client.ts'
import {getContactsForDMRoute} from '@/utils/constants.ts'
import {useAppStore} from '@/store'

export const useGetContactsDM = () => {
  const setDirectMessagesContacts = useAppStore(state => state.setDirectMessagesContacts)

  useEffect(() => {
    const getContactsDM = async () => {
      try {
        const response = await apiClient.get(getContactsForDMRoute, {withCredentials: true})
        if (response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getContactsDM()
  }, [])
}
