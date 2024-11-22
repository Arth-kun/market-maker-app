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
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar
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

function SidebarNavigation() {
  const { setOpenMobile, isMobile } = useSidebar()

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Markets</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.path} onClick={handleClick}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function Layout() {
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
        <SidebarTrigger className="absolute top-4 left-4 lg:hidden z-50 bg-background p-2 rounded-sm shadow-md" />
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4 bg-background">
            <h1 className="text-xl font-bold">Montreal's Markets</h1>
          </SidebarHeader>
          <SidebarContent className="bg-background">
            <SidebarNavigation />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 relative overflow-hidden pt-8 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
