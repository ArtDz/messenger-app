import type {ReactNode} from 'react'

export const Title = ({children}: {children:ReactNode}) => {
  return (
    <h6 className='uppercase tracking-widest text-neutral-400/90 text-sm pl-10 font-light'>
      {children}
    </h6>
  )
}
