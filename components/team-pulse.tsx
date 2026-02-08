"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getDashboardData } from "@/app/actions/dashboard"
import { Loader2 } from "lucide-react"

export function TeamPulse() {
  const [team, setTeam] = useState<{name: string, mood: number, status: string}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      const fetchData = async () => {
          const result = await getDashboardData();
          if (result.success && result.data) {
              setTeam(result.data.teamPulse as any);
          }
          setLoading(false);
      }
      fetchData();
  }, [])

  if (loading) {
      return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 w-full h-[200px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )
  }

  const averageMood = team.length > 0 
    ? Math.round(team.reduce((acc, curr) => acc + curr.mood, 0) / team.length) 
    : 0;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 w-full">
      <h3 className="font-semibold leading-none tracking-tight mb-4">Team Pulse</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {team.map((member, i) => (
          <div key={member.name} className="flex flex-col items-center gap-2 w-full group">
            <div 
                className="w-full bg-primary/20 rounded-t-md relative transition-all duration-500 hover:bg-primary/40 group-hover:scale-105"
                style={{ height: `${member.mood}%` }}
            >
                <div className={cn(
                    "absolute top-2 right-2 w-2 h-2 rounded-full",
                    member.status === 'online' ? "bg-green-500" : 
                    member.status === 'in-meeting' ? "bg-amber-500" : "bg-slate-300"
                )} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{member.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-center text-muted-foreground">
        Average Mood: <span className="font-bold text-foreground">Good ({averageMood}%)</span>
      </div>
    </div>
  )
}
