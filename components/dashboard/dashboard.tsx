import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-switcher";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-sky-200 via-indigo-200 to-sky-200 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-xl m-3 flex flex-col h-[calc(100vh-24px)] overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4 bg-transparent">
          <div className="flex items-center gap-6">
            <SidebarTrigger className="rounded-full dark:hover:bg-[#222222]" />
            <BreadcrumbNav />
          </div>
          <ThemeToggle />
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
