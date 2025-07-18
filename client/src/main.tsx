import {Toaster} from '@/components/ui/sonner.tsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster closeButton position='top-right'/>
  </>,
)
