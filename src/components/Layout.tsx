import { Link, Outlet } from 'react-router-dom'
import { 
  Sidebar, 
  SidebarContent,
  SidebarProvider,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from './ui/sidebar'
import { MapIcon, CalendarIcon, ListIcon } from 'lucide-react'

const menuItems = [
  {
    title: "Map",
    icon: MapIcon,
    path: "/"
  },
  {
    title: "Calendar",
    icon: CalendarIcon,
    path: "/calendar"
  },
  {
    title: "Markets List",
    icon: ListIcon,
    path: "/markets"
  }
]

export function Layout() {
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h1 className="text-xl font-bold">Montreal's Markets</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Markets</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 relative overflow-hidden">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}






