import { Link } from "react-router-dom"


function Footer() {
  return (
    <>
      <footer className="flex flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-8 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500 bg-black">
        <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
          <Link>
            <p onClick={() => navigate('/')} className='w-32 h-auto text-2xl'> Movie<span className='text-pink-600'>Mate</span>🎬</p>
          </Link>
          <div>
            <p className="text-slate-100 font-semibold">Product</p>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="hover:text-indigo-600 transition">Home</a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">Support</a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">Pricing</a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">Affiliate</a></li>
            </ul>
          </div>
          <div>
            <p className="text-slate-100 font-semibold">Resources</p>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="hover:text-indigo-600 transition">Company</a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">Blogs</a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">Community <span className="text-xs text-white bg-pink-600 rounded-md ml-2 px-2 py-1">Book Now!</span></a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">About</a></li>
            </ul>
          </div>
          <div>
            <p className="text-slate-100 font-semibold">Legal</p>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="hover:text-indigo-600 transition">Privacy</a></li>
              <li><a href="/" className="hover:text-indigo-600 transition">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <footer className="flex flex-col md:flex-row gap-3 items-center justify-around w-full px-4 py-4 text-sm bg-slate-800 text-white/70">
        <p>Copyright © 2025<span onClick={() => navigate('/')} className='w-28 h-auto text-xl'> Movie<span className='text-pink-600'>Mate</span>🎬</span>. All rights reservered.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-all">
            Contact Us
          </a>
          <div className="h-8 w-px bg-white/20"></div>
          <a href="#" className="hover:text-white transition-all">
            Privacy Policy
          </a>
          <div className="h-8 w-px bg-white/20"></div>
          <a href="#" className="hover:text-white transition-all">
            Trademark Policy
          </a>
        </div>
      </footer>
    </>
  )
}

export default Footer