import {useAppStore} from '@/store'
import {useNavigate} from 'react-router'
import {type ChangeEvent, useRef, useState} from 'react'
import {IoArrowBack} from 'react-icons/io5'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar.tsx'
import {cn, colors, getColor} from '@/lib/utils.ts'
import {FaPlus, FaTrash} from 'react-icons/fa'
import {Input} from '@/components/ui/input.tsx'
import {Button} from '@/components/ui/button.tsx'
import {toast} from 'sonner'
import {apiClient} from '@/lib/api-client.ts'
import {addProfileImageRoute, HOST, removeProfileImageRoute, updateProfileRoute} from '@/utils/constants.ts'
import type {AxiosResponse} from 'axios'

const ProfilePage = () => {
  const navigate = useNavigate()
  const userInfo = useAppStore(state => state.userInfo)
  const setUserInfo = useAppStore(state => state.setUserInfo)
  const [firstName, setFirstName] = useState(userInfo?.firstName || '')
  const [image, setImage] = useState<string | null>(userInfo?.image ? `${HOST}/${userInfo.image}` : null)
  const [hovered, setHovered] = useState(false)
  const [color, setColor] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const validateProfile = () => {
    if (!firstName) {
      toast.error('Please enter first name.')
      return false
    }

    return true
  }

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(updateProfileRoute, {firstName, color}, {withCredentials: true}) as AxiosResponse<{user: User}>
        if (response.status === 200 && response.data.user._id) {
          setUserInfo(response.data.user)
          setColor(response.data.user.color || 0)
          toast.success('Profile updated successfully!')
          navigate('/chat')
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Something went wrong!')
      }
    }
  }

  const handleFileInputRef = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append(event.target.name, file)
      const response = await apiClient.post(addProfileImageRoute, formData, {withCredentials: true}) as AxiosResponse<{user: User}>
      if (response.status === 200 && response.data.user.image) {
        setUserInfo(response.data.user)
        setImage(`${HOST}/${response.data.user.image}`)
        toast.success('Image updated successfully!')
      }
    }
  }

  const handleDeleteImage =async () => {
    try {
      const res = await apiClient.delete(removeProfileImageRoute, {withCredentials: true})
      if (res.status === 200) {
        setUserInfo({...userInfo, image: null} as User)
        setImage(null)
        toast.success('Image deleted successfully!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        {userInfo?.profileSetup && (<div>
          <IoArrowBack className="text-4xl cursor-pointer" onClick={() => navigate('/chat')}/>
        </div>)}
        <div className="grid grid-cols-2">
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="h-full w-32 md:w-48 md:h-48 relative flex-center"
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">

                <AvatarImage src={image as string} alt="profile image" className="object-cover h-full w-full bg-full"/>
                <AvatarFallback
                  className={`${getColor(color)} uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex-center`}>
                  {firstName ? firstName[0] : '?'}
                </AvatarFallback>
            </Avatar>
            {hovered && (
              <div
                onClick={image ? handleDeleteImage : handleFileInputRef}
                className="absolute inset-0 flex-center bg-black/50 ring-fuchsia-50 rounded-full">
                {image
                  ? <FaTrash className="text-white text-3xl cursor-pointer"/>
                  : <FaPlus className="text-white text-3xl cursor-pointer"/>
                }
              </div>
            )}
            <input
              type="file"
              className='hidden'
              ref={fileInputRef}
              onChange={handleImageChange}
              accept='image/*'
              name="profile-image"
            />
          </div>
          <div className="flex-center flex-col min-w-32 md:min-w-64 gap-5 text-white">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-lg p-6 border-none bg-[#2c2e3b]"
                value={userInfo?.email}
                disabled
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First name"
                type="text"
                className="rounded-lg p-6 border-none bg-[#2c2e3b]"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <ul className='w-full flex gap-5'>
              {colors.map((clr, index) => (
               <li
                 key={index}
                 onClick={() => setColor(index)}
                 className={cn(
                   `h-8 w-8 rounded-full cursor-pointer transition-all duration-300`,
                   clr,
                   {'outline outline-white' : color === index} )}
               ></li>
              ))}
            </ul>
          </div>

        </div>
        <div className='w-full'>
          <Button onClick={saveChanges} className='h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'>Save changes</Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
