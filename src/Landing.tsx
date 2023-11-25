import { useEffect } from 'react'
import me from './assets/me.png'

const Landing = () => {
  const handleScroll = () => {
    const currentScrollPos = scrollY
    const about = document.getElementById('goto-about')
    if (about && currentScrollPos >= about.offsetTop) {
      const home = document.getElementById('landing-img')
      home?.classList.add('hidden')
    } else {
      const home = document.getElementById('landing-img')
      home?.classList.remove('hidden')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div id="goto-home" className="-z-50 relative overflow-hidden w-[90%] h-screen flex flex-col items-center justify-center p-0">
      <h2 className='fixed top-[20%] lg:top-[8%] font-bold text-black text-6xl md:text-8xl lg:text-[150pt]'>Hi there! I'm</h2>
      <h1 className="fixed univers top-[28%] font-bold text-black md:text-[100pt] text-8xl lg:text-[150pt]">Aamir</h1>
      <img id="landing-img" src={me} alt="" className='fixed w-96 md:w-1/3 lg:-mt-[5%] lg:w-[500px] bottom-0' />
    </div>
  )
}

export default Landing