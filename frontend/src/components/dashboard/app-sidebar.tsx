"use client"

import * as React from "react"
import {
  BookOpen,
  GraduationCap,
  Video,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: string
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const router = useRouter()
  const [username, setUsername] = React.useState('')
  
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUsername(payload.username || '')
      } catch (error) {
        console.error('Failed to parse token')
      }
    }
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const adminNavItems = [
    {
      title: "Overview",
      url: "/dashboard/admin",
      icon: BookOpen,
      isActive: true,
    }
  ]

  const teacherNavItems = [
    {
      title: "My Courses",
      url: "/dashboard/teacher",
      icon: BookOpen,
      isActive: true,
    },
    {
      title: "Lectures",
      url: "/dashboard/teacher/lectures",
      icon: Video,
    },
  ]

  const userData = {
    username: username,
    role: userRole,
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Urja Courses</span>
                  <span className="truncate text-xs capitalize">{userRole} Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={userRole === 'admin' ? adminNavItems : teacherNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
