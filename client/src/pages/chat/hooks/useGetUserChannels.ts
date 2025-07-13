import {useEffect} from 'react'
import {apiClient} from '@/lib/api-client.ts'
import {getUserChannelsRoute} from '@/utils/constants.ts'
import type {AxiosResponse} from 'axios'
import {useAppStore} from '@/store'

export const useGetUserChannels = () => {
  const setChannels = useAppStore(state => state.setChannels)

  useEffect(() => {
    const getUserChannels = async () => {
      try {
        const response = await apiClient.get(getUserChannelsRoute, {withCredentials: true}) as AxiosResponse<{channels: Channel[]}>
        if (response.data.channels) {
          setChannels(response.data.channels)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getUserChannels()
  }, []);
};
