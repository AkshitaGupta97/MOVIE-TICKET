import { LayoutDashboardIcon, PlusSquareIcon } from "lucide-react"

function AdminSidebar() {

    const user = {
        firstName: "Admin",
        lastName: "User",
        imageUrl: "abc"
    }

    const adminNavLinks = [
        {name:"Dashboard", path:"/admin", icon: LayoutDashboardIcon},
        {name:"Add Shows", path:"/admin/add-shows", icon: PlusSquareIcon},
        {name: "List Shows", path:""}
    ]

  return (
    <div>
        
    </div>
  )
}

export default AdminSidebar