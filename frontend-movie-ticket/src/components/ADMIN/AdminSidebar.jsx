import { LayoutDashboardIcon, Link, ListCollapseIcon, ListIcon, PlusSquareIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

function AdminSidebar() {

  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
  }

  const adminNavLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    { name: "List Bookings", path: "/admin/list-bookings", icon: ListCollapseIcon}
  ]

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r
    border-gray-400 text-sm ">
      <img className="h-16 w-16 md-w-14 rounded-full mx-auto" src={user.imageUrl} alt="profile" />
      <p className="text-orange-300 border-b border-b-gray-300 mt-2 text-base max-md:hidden">{user.firstName} {user.lastName}</p>

      <div className="w-full">
        {
          adminNavLinks.map((link, index) => (
            <NavLink key={index} to={link.path} end
            className={({isActive}) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 
              first:mt-6 text-gary-400 ${isActive && 'bg-pink-700 border-r-4 rounded border-gray-600 text-gray-300 group'}`}>
              {({isActive}) => (
                <>  
                  <link.icon className="w-6 h-6" />
                  <p className="max-md:hidden">{link.name}</p>
                  <span className={`w-2 h-10 rounded-1 right-0 absolute ${isActive && 'bg-pink-700'}`}></span>
                </>
              )}
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}


export default AdminSidebar