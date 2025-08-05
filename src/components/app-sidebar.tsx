
"use client";

import {
  Bell,
  BotMessageSquare,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Share2,
  CalendarClock
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Sheet, SheetTrigger } from "./ui/sheet";
import AiChatSheet from "./ai-chat-sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="glassmorphism !border-border/20">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold">MediSafe Pro</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={pathname === "/"}
              >
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/documents">
              <SidebarMenuButton tooltip="Documents" isActive={pathname.startsWith("/documents")}>
                <FileText />
                Documents
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/sharing">
              <SidebarMenuButton tooltip="Sharing" isActive={pathname === "/sharing"}>
                <Share2 />
                Sharing
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/reminders">
              <SidebarMenuButton tooltip="Reminders" isActive={pathname === "/reminders"}>
                <CalendarClock />
                Reminders
              </SidebarMenuButton>
             </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications">
              <Bell />
              Notifications
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" className="w-full justify-start gap-2">
                    <BotMessageSquare />
                    AI Assistant
                </Button>
            </SheetTrigger>
            <AiChatSheet />
        </Sheet>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton tooltip="Settings" isActive={pathname === "/settings"}>
                <Settings />
                Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
