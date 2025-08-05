"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Document } from "@/types";
import { UserProfile } from "@/components/auth/user-profile";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";


interface HeaderProps {
    onSearchChange: (term: string) => void;
    onDocumentUploaded?: (doc: Document) => void;
}

export default function Header({ onSearchChange, onDocumentUploaded }: HeaderProps) {
  const { user } = useAuth();

  return (
     <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/60 px-4 backdrop-blur-lg sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>

            {user ? (
              <UserProfile />
            ) : (
              <AuthDialog trigger={<Button variant="outline">Sign In</Button>} />
            )}
          </div>
        </header>
  );
}
