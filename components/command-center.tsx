"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useChat } from '@ai-sdk/react';

import { cn } from "@/lib/utils"
import { getUser } from "@/app/actions/user"
import { PromotionModal } from "@/components/lifecycle-modals"

export function CommandCenter() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [user, setUser] = React.useState<any>(null)
  const [promotionTarget, setPromotionTarget] = React.useState<{id: string, name: string} | null>(null)
  const router = useRouter()
  
  const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/chat',
    maxSteps: 5,
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const fetchUser = async () => {
      const u = await getUser()
      setUser(u)
    }
    fetchUser()
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query) {
        // Check for "Promote [Name]"
        if (query.toLowerCase().startsWith("promote ")) {
            const name = query.substring(8);
            // Mock finding user
            setPromotionTarget({ id: 'user-2', name: name }); // Always promote "user-2" or the name typed
            setOpen(false);
            setQuery("");
            return;
        }

        // Check if it matches a static command first
        const staticCommands = ["day off", "pay", "org chart", "dashboard", "executive insights", "benefits", "onboarding"];
        if (staticCommands.some(c => query.toLowerCase().includes(c))) {
             return; // Let standard filtering handle it
        }

        // Otherwise, send to AI
        e.preventDefault();
        await append({ role: 'user', content: query });
        setQuery(""); // Clear input to show results cleanly
    }
  }

  // AI Logic
  const lastMessage = messages[messages.length - 1];
  const isAIResponse = lastMessage?.role === 'assistant';

  return (
    <>
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground hidden md:block border px-2 py-1 rounded-md bg-background/50 backdrop-blur">
        Press <kbd className="font-mono bg-muted px-1 rounded">Cmd+K</kbd> to search
      </div>
      <CommandPrimitive.Dialog
        open={open}
        onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
                setQuery("");
                setMessages([]); // Clear chat on close
            }
        }}
        label="Global Command Menu"
        className="fixed top-[20%] left-1/2 -translate-x-1/2 max-w-[640px] w-full bg-popover text-popover-foreground shadow-2xl rounded-xl border overflow-hidden z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandPrimitive.Input 
             className={cn(
               "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
             )}
             placeholder="Type 'Day off', 'Pay', or ask: 'How much vacation do I have?'"
             value={query}
             onValueChange={setQuery}
             onKeyDown={handleKeyDown}
          />
          {user && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{user.email}</span>
            </div>
          )}
        </div>
        <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            
          {/* AI Response Area */}
          {(isLoading || isAIResponse) && (
              <div className="p-3 mb-2 bg-muted/30 rounded-lg text-sm">
                  {isLoading && !isAIResponse ? (
                      <div className="flex items-center gap-2 animate-pulse text-muted-foreground">
                          ✨ AI is thinking...
                      </div>
                  ) : (
                      <div className="flex gap-2">
                          <span className="text-xl">🤖</span>
                          <div className="prose prose-sm dark:prose-invert">
                              {lastMessage?.content}
                              {lastMessage?.toolInvocations?.map(tool => (
                                  <div key={tool.toolCallId} className="mt-1 text-xs bg-muted px-2 py-1 rounded border">
                                      Called: {tool.toolName}
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          )}

          <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
             No results found. Press Enter to ask AI.
          </CommandPrimitive.Empty>

          <CommandPrimitive.Group heading="Quick Actions" className="text-xs text-muted-foreground font-medium px-2 py-1.5">
            <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/time'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              🗓️ Request Day Off
            </CommandPrimitive.Item>
            <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/payroll'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              💰 View Latest Payslip
            </CommandPrimitive.Item>
             <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/onboarding'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              🚀 Onboarding Checklist
            </CommandPrimitive.Item>
             <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/benefits'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              ❤️ Manage Benefits
            </CommandPrimitive.Item>
            <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/expenses'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              💸 Expense Management
            </CommandPrimitive.Item>
            <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/goals'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              🎯 Goals & OKRs
            </CommandPrimitive.Item>
             <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/people'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              👥 View Org Chart
            </CommandPrimitive.Item>
          </CommandPrimitive.Group>
          
          <CommandPrimitive.Group heading="Navigation" className="text-xs text-muted-foreground font-medium px-2 py-1.5">
             <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              🏠 Dashboard
            </CommandPrimitive.Item>
            <CommandPrimitive.Item
              onSelect={() => runCommand(() => router.push('/insights'))}
              className="flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
            >
              📊 Executive Insights
            </CommandPrimitive.Item>
          </CommandPrimitive.Group>
        </CommandPrimitive.List>
      </CommandPrimitive.Dialog>
      
      {open && (
         <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
      )}
      
      {promotionTarget && (
        <PromotionModal 
            userId={promotionTarget.id} 
            userName={promotionTarget.name} 
            onClose={() => setPromotionTarget(null)} 
        />
      )}
    </>
  )
}
