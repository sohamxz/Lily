"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, ChevronRight, CheckCircle2, Circle, Plus, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchMyGoals, updateKRProgress } from "@/app/actions/goals"

export default function GoalsPage() {
  const [goals, setGoals] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expanded, setExpanded] = React.useState<string[]>([])

  React.useEffect(() => {
    async function load() {
      const data = await fetchMyGoals()
      setGoals(data)
      setExpanded(data.map(g => g.id)) // Default expand all
      setLoading(false)
    }
    load()
  }, [])

  const toggleExpand = (id: string) => {
      setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleUpdate(krId: string, current: number, target: number) {
      if (current >= target) return; // Cap at target for this simple UI
      const newValue = current + 1;
      
      // Optimistic
      setGoals(prev => prev.map(g => ({
          ...g,
          keyResults: g.keyResults.map((kr: any) => kr.id === krId ? { ...kr, currentValue: newValue } : kr)
      })))

      await updateKRProgress(krId, newValue);
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals & OKRs</h1>
          <p className="text-muted-foreground">Align your work with company objectives.</p>
        </div>
        <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Goal
        </Button>
      </header>

      <div className="space-y-6">
          {goals.map((goal) => {
              const isExpanded = expanded.includes(goal.id)
              const statusColor = goal.status === 'completed' ? 'text-green-600' : 'text-primary'
              
              return (
                  <Card key={goal.id} className="overflow-hidden">
                      <div 
                        className="p-6 flex items-start gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => toggleExpand(goal.id)}
                      >
                           <div className={`mt-1 ${statusColor}`}>
                               <Target className="w-6 h-6" />
                           </div>
                           <div className="flex-1">
                               <div className="flex items-center justify-between">
                                   <h3 className="text-xl font-semibold">{goal.title}</h3>
                                   <div className="flex items-center gap-4">
                                       <span className="font-bold text-lg">{goal.progress}%</span>
                                       <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                   </div>
                               </div>
                               <p className="text-muted-foreground">{goal.description}</p>
                               <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                                   <motion.div 
                                      className={`h-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${goal.progress}%` }}
                                   />
                               </div>
                           </div>
                      </div>

                      <AnimatePresence>
                          {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-muted/20 border-t"
                              >
                                  <div className="p-6 pt-2 space-y-4">
                                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Results</h4>
                                      {goal.keyResults.map((kr: any) => (
                                          <div key={kr.id} className="flex items-center gap-4 bg-background p-4 rounded-lg border">
                                              <div className="flex-1">
                                                  <div className="font-medium">{kr.title}</div>
                                                  <div className="text-sm text-muted-foreground flex gap-1 mt-1">
                                                      <span>{kr.currentValue} / {kr.targetValue}</span>
                                                      <span className="capitalize">{kr.unit}</span>
                                                  </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                                      <div 
                                                        className="h-full bg-blue-500" 
                                                        style={{ width: `${(kr.currentValue / kr.targetValue) * 100}%` }} 
                                                      />
                                                  </div>
                                                  <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    onClick={(e) => { e.stopPropagation(); handleUpdate(kr.id, kr.currentValue, kr.targetValue); }}
                                                    disabled={kr.currentValue >= kr.targetValue}
                                                  >
                                                      <TrendingUp className="w-4 h-4 mr-1" /> Update
                                                  </Button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </Card>
              )
          })}
      </div>
    </div>
  )
}
