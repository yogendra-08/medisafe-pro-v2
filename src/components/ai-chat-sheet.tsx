"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Bot, User, CornerDownLeft, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { explainMedicalTerm } from "@/lib/actions";
import { Card, CardContent } from "./ui/card";

type Message = {
  role: "user" | "bot" | "error";
  content: string;
};

const initialState = {
  success: false,
  message: null,
  explanation: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CornerDownLeft className="h-4 w-4" />
      )}
    </Button>
  );
}

export default function AiChatSheet() {
  const [state, formAction] = React.useActionState(explainMedicalTerm, initialState);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success && state.explanation) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: state.explanation! },
      ]);
    } else if (!state.success && state.message) {
       setMessages((prev) => [
        ...prev,
        { role: "error", content: state.message! },
      ]);
    }
  }, [state]);

  const handleFormSubmit = (formData: FormData) => {
    const term = formData.get("term") as string;
    if (term) {
      setMessages((prev) => [...prev, { role: "user", content: term }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>AI Medical Assistant</SheetTitle>
        <SheetDescription>
          Ask for simple explanations of complex medical terms.
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="flex-1 my-4 pr-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role !== "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <Card
                className={`max-w-xs p-3 ${
                  msg.role === "bot"
                    ? "bg-secondary"
                    : msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                <CardContent className="p-0 text-sm">
                  {msg.content}
                </CardContent>
              </Card>

              {msg.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {messages.length === 0 && (
             <div className="text-center text-sm text-muted-foreground">
                <Bot className="mx-auto h-10 w-10 mb-2"/>
                <p>Start a conversation by asking about a medical term below.</p>
             </div>
           )}
        </div>
      </ScrollArea>
      <SheetFooter>
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            name="term"
            id="term"
            placeholder="e.g., 'Metformin'"
            autoComplete="off"
            required
          />
          <SubmitButton />
        </form>
      </SheetFooter>
    </SheetContent>
  );
}
