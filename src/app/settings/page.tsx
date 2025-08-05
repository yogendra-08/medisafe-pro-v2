
"use client";

import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Header onSearchChange={setSearchTerm} />
          <div className="grid gap-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold mb-4">User Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                  </div>
                   <Button className="mt-4">Update Profile</Button>
                </section>
                
                <Separator />

                <section>
                    <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                     <div className="space-y-4">
                      <div className="space-y-2 max-w-sm">
                        <Label htmlFor="theme">Theme</Label>
                         <Select value={theme} onValueChange={setTheme}>
                           <SelectTrigger id="theme">
                             <SelectValue placeholder="Select theme" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="light">Light</SelectItem>
                             <SelectItem value="dark">Dark</SelectItem>
                             <SelectItem value="system">System</SelectItem>
                           </SelectContent>
                         </Select>
                         <p className="text-sm text-muted-foreground">
                           Choose how the application should look.
                         </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label>Quick Toggle:</Label>
                        <ThemeToggle />
                      </div>
                    </div>
                </section>
                
                <Separator />

                <section>
                    <h3 className="text-lg font-semibold mb-4">Authentication</h3>
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.displayName?.[0] || user.email?.[0] || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.displayName || 'User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You are signed in and your data is securely synced.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Create an account to securely save your data across devices.
                        </p>
                        <AuthDialog trigger={<Button>Sign In / Sign Up</Button>} />
                      </div>
                    )}
                </section>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
