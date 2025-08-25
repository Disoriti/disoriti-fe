"use client";

import "@/app/globals.css";

import { AppSidebar } from "@/components/app-sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import CreditsIndicator from "@/components/ui/credits-indicator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Separate client component for the header content
function DashboardHeader({ breadcrumb }: { breadcrumb: React.ReactNode }) {
  const { plan } = useAuth();
  
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumb}
      </div>
      <div className="flex items-center gap-3">
        <Badge>{(plan || 'Free') + ' user'}</Badge>
        <CreditsIndicator />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
  breadcrumb,
}: {
  children: React.ReactNode,
  breadcrumb: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader breadcrumb={breadcrumb} />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
