"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1.5">
        {items.map((item) => {
          // More precise active state detection
          // Mark as active if:
          // 1. Exact match, OR
          // 2. It's a child route AND no other item has a longer matching URL
          const isExactMatch = pathname === item.url
          const isChildRoute = pathname?.startsWith(item.url + "/")
          
          // Check if there's a more specific route (longer URL) that also matches
          const hasMoreSpecificMatch = items.some(otherItem => 
            otherItem.url !== item.url && 
            otherItem.url.startsWith(item.url + "/") &&
            pathname?.startsWith(otherItem.url)
          )
          
          const isActive = isExactMatch || (isChildRoute && !hasMoreSpecificMatch)
          
          return item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={isActive}
                    className="relative group/button overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Futuristic glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 blur-sm" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover/button:opacity-100 group-data-[active=true]/button:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icon with glow */}
                    <div className="relative z-10">
                      {item.icon && (
                        <div className="relative">
                          <item.icon className="relative z-10 transition-all duration-300 group-hover/button:scale-110 group-data-[active=true]/button:text-white" />
                          <item.icon className="absolute inset-0 text-primary opacity-0 blur-md group-hover/button:opacity-50 group-data-[active=true]/button:opacity-50 transition-opacity duration-300" />
                        </div>
                      )}
                    </div>
                    <span className="relative z-10 font-medium transition-all duration-300 group-hover/button:translate-x-0.5 group-data-[active=true]/button:text-white">{item.title}</span>
                    <ChevronRight className="ml-auto relative z-10 transition-all duration-300 group-data-[state=open]/collapsible:rotate-90 group-hover/button:translate-x-0.5" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          asChild
                          isActive={pathname === subItem.url}
                          className="relative group/sub overflow-hidden transition-all duration-300 hover:translate-x-1"
                        >
                          <a href={subItem.url}>
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover/sub:opacity-100 group-data-[active=true]:opacity-100 transition-all duration-300" />
                            <span className="relative z-10">{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild
                isActive={isActive}
                className="relative group/button overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                <a href={item.url}>
                  {/* Futuristic glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 blur-sm" />
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover/button:opacity-100 group-data-[active=true]:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon with glow */}
                  <div className="relative z-10">
                    {item.icon && (
                      <div className="relative">
                        <item.icon className="relative z-10 transition-all duration-300 group-hover/button:scale-110 group-data-[active=true]:text-white" />
                        <item.icon className="absolute inset-0 text-primary opacity-0 blur-md group-hover/button:opacity-50 group-data-[active=true]:opacity-50 transition-opacity duration-300" />
                      </div>
                    )}
                  </div>
                  <span className="relative z-10 font-medium transition-all duration-300 group-hover/button:translate-x-0.5 group-data-[active=true]:text-white">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
