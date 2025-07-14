"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  MessageSquare,
  Calendar
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  company: {
    name: "Disoriti",
    logo: "/logo-primary-main.png",
    logoCollapsed: "/logo-primary.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Create",
      url: "/dashboard/create",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Library",
      url: "/dashboard/library",
      icon: Bot,
    },
    {
      title: "Disoriti Chat",
      url: "/dashboard/chat",
      icon: MessageSquare,
    },
    {
      title: "Scheduler",
      url: "/dashboard/scheduler",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center p-2">
          <img
            src={isCollapsed ? data.company.logoCollapsed : data.company.logo}
            alt={data.company.name}
            className={isCollapsed ? "max-w-[32px] max-h-[40px] w-full h-auto" : "max-w-[110px] max-h-[40px] w-full h-auto mt-3"}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
