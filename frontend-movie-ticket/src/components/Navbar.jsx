import {Link} from 'react-router-dom'
import {MenuIcon, SearchIcon, XIcon} from 'lucide-react'

function Navbar() {
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link className='max-md:flex-1'>
        <p className='w-36 h-auto text-xl'> Movie<span className='text-pink-600'>Mate</span> 🎬</p>
      </Link>

      <div className='max-md:absolute max-md:top-0 max-md:left-0 max-md:front-medium max-md:text-lg z-50 flex flex-col 
        md:flex-row items-center max-md:justify-center gap-8 min-mdLpx-8 py-3 max-md:h-screen min-md:rounded-4xl backdrop-blur-xl
        bg-black/50 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300  '>
        <XIcon className='md:hidden absolute top-6 right-6 w-6 6 cursor-pointer' />
        <Link to='/'>Home</Link>
        <Link to='/'>Movies</Link>
        <Link to='/'>Threaters</Link>
        <Link to='/'>Releases</Link>
        <Link to='/favourite'>Favourite</Link>
      </div>

      <div className='flex item-center gap-8'>
        <SearchIcon className='max-md:hidden w-6-h-6 cursor-pointer' />
        <button className='px-8 py-2 sm:px-4 bg-pink-700 hover:bg-pink-800
         transition rounded-full font-medium cursor-pointer'>Login</button>
      </div>

      <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' />


    </div>
  )
}

export default Navbar