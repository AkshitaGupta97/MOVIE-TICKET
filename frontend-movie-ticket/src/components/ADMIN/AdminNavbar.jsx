import { Link } from "react-router-dom"

function AdminNavbar() {
  return (
    <div className="flex items-center  bg-gray-900 justify-between px-6 md:px-10 h-14 border-b-2 border-amber-300">
        <Link className='max-md:flex-1'>
            <p onClick={() => navigate('/')} className='w-44 h-auto text-2xl'> Movie<span className='text-pink-600'>Mate</span>🎬</p>
        </Link>
    </div>
  )
}

export default AdminNavbar