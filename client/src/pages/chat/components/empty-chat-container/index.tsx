import {animationDefaultOptions} from '@/lib/utils.ts'
import Lottie from 'react-lottie'

const EmptyChatContainer = () => {
  return (
    <section className="w-full flex-1 md:bg-[#1c1d25] md:flex-center flex-col hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className='text-white/80 text-center flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300'>
        <h3 className='poppins-medium'>
          Hi<span className='text-purple-500'>!</span>{' '}
          Welcome to <span className='text-purple-500'>Realtime</span>{' '}
          Chat App<span className='text-purple-500'>.</span>
        </h3>
      </div>
    </section>
  )
}

export default EmptyChatContainer
