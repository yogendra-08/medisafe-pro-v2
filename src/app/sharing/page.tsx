"use client";

import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function SharingPage() {
    const [searchTerm, setSearchTerm] = useState("");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Header onSearchChange={setSearchTerm} />
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Sharing</CardTitle>
              <CardDescription>This is the sharing page.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content for sharing goes here.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
