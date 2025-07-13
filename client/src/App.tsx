import {BrowserRouter, Navigate, Route, Routes} from 'react-router'
import {AppRoutes} from '@/routes/routes.ts'
import {lazy, type ReactNode} from 'react'
import {useAppStore} from '@/store'
import {useCheckUser} from '@/hooks/useCheckUser.tsx'

const AuthPage = lazy(() => import('@/pages/auth'))
const ProfilePage = lazy(() => import('@/pages/profile'))
const ChatPage = lazy(() => import('@/pages/chat'))

const PrivateRoute = ({children}: {children: ReactNode}) => {
  const isAuthenticated = useAppStore(state => state.userInfo)
  return isAuthenticated ? children : <Navigate to={AppRoutes.Auth} />
}

const AuthRoute = ({children}: {children: ReactNode}) => {
  const isAuthenticated = useAppStore(state => state.userInfo)
  return isAuthenticated ?  <Navigate to={AppRoutes.Chat} />: children
}

function App() {
  useCheckUser()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.Auth} element={<AuthRoute><AuthPage /></AuthRoute>} />
          <Route path={AppRoutes.Chat} element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path={AppRoutes.Profile} element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path='*' element={<Navigate to={AppRoutes.Auth} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
