import {useAppStore} from '@/store'
import {useEffect, useState} from 'react'
import {userInfoRoute} from '@/utils/constants.ts'
import {apiClient} from '@/lib/api-client.ts'

export const useCheckUser = () => {
  const userInfo = useAppStore(state => state.userInfo)
  const setUserInfo = useAppStore(state => state.setUserInfo)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(userInfoRoute, {withCredentials: true})
        setUserInfo(response.status === 200 && response.data.user.id ? response.data.user : null)
      } catch (error) {
        console.log(error)
        setUserInfo(null)
      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) getUserData()
  }, [setUserInfo, userInfo]);

  if (loading) return <div>Loading...</div>
}
