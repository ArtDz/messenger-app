import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx'
import {useState} from 'react'
import {Input} from '@/components/ui/input.tsx'
import {Button} from '@/components/ui/button.tsx'
import {toast} from 'sonner'
import {apiClient} from '@/lib/api-client.ts'
import {loginRoute, signupRoute} from '@/utils/constants.ts'
import {useNavigate} from 'react-router'
import {AppRoutes} from '@/routes/routes.ts'
import type {AxiosResponse} from 'axios'
import {useAppStore} from '@/store'

const AuthPage = () => {
  const navigate = useNavigate()
  const setUserInfo = useAppStore(state => state.setUserInfo)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateSignup = () => {
    if (!email || !password) {
      toast.error('Please enter email and passwords.')
      return false
    }

    if (confirmPassword && password !== confirmPassword) {
      toast.error('Passwords must be identical.')
      return false
    }

    return true
  }

  const handleLogin = async () => {
    const validate = validateSignup()
    if (validate) {
      const response = await apiClient
        .post(loginRoute, {email, password}, {withCredentials: true}) as AxiosResponse<{user: User}>
      setUserInfo(response.data.user)
      if (response.data.user.profileSetup) {
        navigate(AppRoutes.Chat)
      } else navigate(AppRoutes.Profile)
    }
  }

  const handleSignup = async () => {
    const validate = validateSignup()
    if (validate) {
      const response = await apiClient
        .post(signupRoute, {email, password}, {withCredentials: true}) as AxiosResponse<{user: User}>
      setUserInfo(response.data.user)
      if (response.status === 201) {
        navigate(AppRoutes.Profile)
      }
    }
  }

  return (
    <main className="h-screen w-screen flex-center">
      <section className='h-[80vh] w-[80vw] bg-white border-2 border-white shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
        <div className='flex-center flex-col gap-10'>
          <div className='flex-center flex-col'>
            <div className='flex-center'>
              <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
              <img src={Victory} alt="Victory emoji" className='h-[100px]'/>
            </div>
            <p>Fill in the details to get started with the best chat app!</p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs className='w-3/4' defaultValue='login'>
              <TabsList className='bg-transparent rounded-none w-full'>
                <TabsTrigger value='login' className='data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-black border-b-2 rounded-none w-full'>Login</TabsTrigger>
                <TabsTrigger value='signup' className='data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-black border-b-2 rounded-none w-full'>Signup</TabsTrigger>
              </TabsList>
              <TabsContent className='flex flex-col gap-5 mt-10' value='login'>
                <Input
                placeholder='Email'
                type='email'
                className='rounded-full p-6'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
                <Input
                  placeholder='Password'
                  type='password'
                  className='rounded-full p-6'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button onClick={handleLogin} className='rounded-full p-6'>Login</Button>
              </TabsContent>
              <TabsContent className='flex flex-col gap-5 mt-10' value='signup'>
                <Input
                  placeholder='Email'
                  type='email'
                  className='rounded-full p-6'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  placeholder='Password'
                  type='password'
                  className='rounded-full p-6'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Input
                  placeholder='Confirm Password'
                  type='password'
                  className='rounded-full p-6'
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <Button onClick={handleSignup} className='rounded-full p-6'>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className='hidden xl:flex-center'>
          <img src={Background} alt="background" />
        </div>
      </section>
    </main>
  )
}

export default AuthPage
