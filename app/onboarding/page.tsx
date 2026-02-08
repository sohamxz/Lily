"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Laptop, FileText, MonitorPlay, Users, Confetti } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { fetchMyWorkflow, fetchWorkflowTasks, markTaskComplete } from "@/app/actions/onboarding"

const TASK_ICONS: Record<string, any> = {
  hardware: Laptop,
  document: FileText,
  training: MonitorPlay,
  task: Users
}

export default function OnboardingPage() {
  const [workflow, setWorkflow] = React.useState<any>(null)
  const [tasks, setTasks] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      const wf = await fetchMyWorkflow()
      if (wf) {
        setWorkflow(wf)
        const t = await fetchWorkflowTasks(wf.id)
        setTasks(t)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleComplete(taskId: string) {
      // Optimistic
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t))
      // Update local workflow progress roughly
      setWorkflow((prev: any) => ({ ...prev, progress: prev.progress + (100/tasks.length) }))
      
      await markTaskComplete(taskId)
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!workflow) return <div className="p-8">No active onboarding workflow found.</div>

  const progress = Math.min(Math.round(workflow.progress), 100)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-4">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
                <p className="text-muted-foreground text-lg">{workflow.title}</p>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-primary">{progress}%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Complete</div>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
      </header>

      <div className="space-y-4">
          {tasks.map((task, index) => {
              const Icon = TASK_ICONS[task.type] || Circle
              const isCompleted = task.status === 'completed'
              
              return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                      <Card className={`transition-all duration-300 ${isCompleted ? 'bg-muted/50 border-muted' : 'border-primary/20 bg-card'}`}>
                          <CardContent className="p-6 flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-semibold text-lg ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm">{task.description}</p>
                                </div>
                                {!isCompleted && (
                                    <Button onClick={() => handleComplete(task.id)}>
                                        Mark Done
                                    </Button>
                                )}
                          </CardContent>
                      </Card>
                  </motion.div>
              )
          })}
      </div>
    </div>
  )
}
