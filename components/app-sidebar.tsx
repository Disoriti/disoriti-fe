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
  Calendar,
  CreditCard
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
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: PieChart,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Pricing",
      url: "/pricing",
      icon: CreditCard,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center p-2 relative">
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 blur-xl rounded-lg" />
          <div className="relative z-10">
            <img
              src={isCollapsed ? data.company.logoCollapsed : data.company.logo}
              alt={data.company.name}
              className={`transition-all duration-300 ${isCollapsed ? "w-10 h-8" : "max-w-[110px] max-h-[40px] w-full h-auto mt-3"} hover:scale-105`}
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
