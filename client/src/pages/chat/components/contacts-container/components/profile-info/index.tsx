import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar.tsx'
import {TooltipContent, TooltipTrigger} from '@/components/ui/tooltip'
import {getColor} from '@/lib/utils.ts'
import {useAppStore} from '@/store'
import {HOST, logoutRoute} from '@/utils/constants.ts'
import {Tooltip} from '@/components/ui/tooltip.tsx'
import {FiEdit2} from 'react-icons/fi'
import {Link, useNavigate} from 'react-router'
import {AppRoutes} from '@/routes/routes.ts'
import {IoLogOut} from 'react-icons/io5'
import {apiClient} from '@/lib/api-client.ts'
import {toast} from 'sonner'

export const ProfileInfo = () => {
  const userInfo = useAppStore(state => state.userInfo)
  const setUserInfo = useAppStore(state => state.setUserInfo)
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      const res = await apiClient.post(logoutRoute,{}, {withCredentials: true})
      if (res.status === 200) {
        toast.success('Logged Out!')
        setUserInfo(null)
        navigate(AppRoutes.Auth)
      }
    } catch (error) {
      console.error(error)
      toast.success('Failed to Logout!')
    }
  }

  return (
    <div className='absolute bottom-0 flex-center gap-2 h-16 w-full px-10 bg-[#2a2b33]'>
      <div className='flex-center gap-3 mr-auto'>
        <div className='w-12 h-12 relative'>
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            <AvatarImage src={`${HOST}/${userInfo?.image}` as string} alt="profile image" className="object-cover h-full w-full bg-full"/>
            <AvatarFallback
              className={`${getColor(userInfo?.color || 0)} uppercase h-12 w-12 text-lg border-[1px] flex-center`}>
              {userInfo?.firstName ? userInfo?.firstName[0] : '?'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          {userInfo?.firstName}
        </div>
      </div>
      <div className='flex gap-5'>
        <Tooltip>
          <TooltipTrigger><Link to={AppRoutes.Profile}><FiEdit2 className='cursor-pointer text-purple-500 text-xl font-medium'/></Link></TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3'>
            Edit Profile
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger onClick={onLogout}><IoLogOut className='cursor-pointer text-orange-400 text-xl font-medium'/></TooltipTrigger>
          <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3'>
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
