"use client"

import { useEffect, useState } from "react"
import { ActionStack } from "@/components/action-stack"
import { TeamPulse } from "@/components/team-pulse"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [greeting, setGreeting] = useState("Hello")
  const [isMorningMode, setIsMorningMode] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good Morning")
      setIsMorningMode(true)
    } else if (hour < 18) {
      setGreeting("Good Afternoon")
    } else {
      setGreeting("Good Evening")
    }
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{greeting}, Alex.</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {isMorningMode 
              ? "☕️ Let's get caught up with your team." 
              : "🚀 You're in the flow."}
          </p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-2xl font-mono">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
      </header>

      {isMorningMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
               <span className="text-xl">☀️</span>
               <div>
                 <span className="font-semibold block">Daily Standup</span>
                 <span className="text-sm opacity-80">Your team meets in 15 mins.</span>
               </div>
            </div>
            <button className="bg-white text-blue-600 px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm hover:shadow hover:bg-blue-50 transition-all">
                Join Now
            </button>
          </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <section>
             <ActionStack />
        </section>
        <section className="space-y-6">
             <TeamPulse />
             
             {/* Quick Stats or other widgets could go here */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="text-muted-foreground text-xs font-semibold uppercase mb-1">Time Off</div>
                    <div className="text-2xl font-bold group-hover:text-primary transition-colors">12 Days</div>
                    <div className="text-xs text-muted-foreground mt-1">Available this year</div>
                 </div>
                 <div className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="text-muted-foreground text-xs font-semibold uppercase mb-1">Next Pay</div>
                    <div className="text-2xl font-bold group-hover:text-primary transition-colors">In 3 Days</div>
                    <div className="text-xs text-muted-foreground mt-1">Mar 15, 2024</div>
                 </div>
             </div>
        </section>
      </div>
    </div>
  )
}
