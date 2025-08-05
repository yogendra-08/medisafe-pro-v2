"use client";

import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

type Reminder = {
  id: number;
  title: string;
  date: string;
  notes: string;
  completed: boolean;
};

export default function RemindersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({ title: "", date: "", notes: "" });

  useEffect(() => {
    const storedReminders = localStorage.getItem("reminders");
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.date) return;
    const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
    setReminders([...reminders, { ...newReminder, id: newId, completed: false }]);
    setNewReminder({ title: "", date: "", notes: "" });
  };
  
  const handleToggleComplete = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Header onSearchChange={setSearchTerm} />
           <div className="grid gap-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Add New Reminder</CardTitle>
                <CardDescription>Create a new reminder for your health tasks.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Input 
                  placeholder="Reminder Title (e.g., Take Metformin)" 
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                />
                <Input 
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                />
                <Textarea 
                  placeholder="Notes (optional)"
                  value={newReminder.notes}
                   onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})}
                />
                <Button onClick={handleAddReminder} className="w-fit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Your Reminders</CardTitle>
                <CardDescription>Manage your upcoming and completed reminders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reminders.length > 0 ? reminders.map(reminder => (
                     <div key={reminder.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/80">
                        <Checkbox 
                           id={`reminder-${reminder.id}`}
                           checked={reminder.completed}
                           onCheckedChange={() => handleToggleComplete(reminder.id)}
                        />
                        <div className="grid gap-1 flex-1">
                           <label 
                              htmlFor={`reminder-${reminder.id}`}
                              className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}
                           >
                              {reminder.title}
                           </label>
                           <p className={`text-sm text-muted-foreground ${reminder.completed ? 'line-through' : ''}`}>
                             Due: {new Date(reminder.date).toLocaleDateString()}
                           </p>
                           {reminder.notes && <p className="text-xs text-muted-foreground">{reminder.notes}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(reminder.id)}>
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-8">You have no reminders yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
           </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
