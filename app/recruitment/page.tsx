"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MoreHorizontal, Bot, Mail, FileText, ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { fetchJobPostings, fetchCandidates, updateCandidateStage, runAIRanking } from "@/app/actions/recruitment"

const STAGES = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { id: 'screening', label: 'Screening', color: 'bg-purple-100 text-purple-800' },
  { id: 'interview', label: 'Interview', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'offer', label: 'Offer', color: 'bg-orange-100 text-orange-800' },
  { id: 'hired', label: 'Hired', color: 'bg-green-100 text-green-800' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
]

export default function RecruitmentPage() {
  const [jobs, setJobs] = React.useState<any[]>([])
  const [selectedJob, setSelectedJob] = React.useState<string>("")
  const [candidates, setCandidates] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [ranking, setRanking] = React.useState(false)

  React.useEffect(() => {
    async function loadJobs() {
      const data = await fetchJobPostings()
      setJobs(data)
      if (data.length > 0) {
        setSelectedJob(data[0].id)
      }
    }
    loadJobs()
  }, [])

  React.useEffect(() => {
    if (!selectedJob) return
    loadCandidates(selectedJob)
  }, [selectedJob])

  async function loadCandidates(jobId: string) {
    setLoading(true)
    const data = await fetchCandidates(jobId)
    setCandidates(data)
    setLoading(false)
  }

  async function handleMove(candidateId: string, stage: string) {
    // Optimistic update
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c))
    await updateCandidateStage(candidateId, stage, selectedJob)
  }

  async function handleAIRank() {
    setRanking(true)
    const ranked = await runAIRanking(selectedJob)
    setCandidates(ranked)
    setRanking(false)
  }

  if (!selectedJob && jobs.length === 0) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Pipeline</h1>
          <p className="text-muted-foreground">Manage candidates and AI rankings.</p>
        </div>
        <div className="flex gap-4">
           <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select Job" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map(job => (
                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleAIRank} disabled={ranking} className="gap-2">
            {ranking ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {ranking ? "Analyzing..." : "AI Rank Candidates"}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full">
            {STAGES.map(stage => (
                <div key={stage.id} className="w-80 flex flex-col gap-4">
                    <div className="flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur py-2 z-10">
                        <div className="flex items-center gap-2">
                             <h3 className="font-semibold">{stage.label}</h3>
                             <Badge variant="secondary">{candidates.filter(c => c.stage === stage.id).length}</Badge>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-h-[200px] h-full rounded-xl bg-muted/20 p-2 border border-dashed">
                        <AnimatePresence mode="popLayout">
                            {candidates.filter(c => c.stage === stage.id).map(candidate => (
                                <CandidateCard 
                                    key={candidate.id} 
                                    candidate={candidate} 
                                    onMove={handleMove}
                                />
                            ))}
                        </AnimatePresence>
                         {candidates.filter(c => c.stage === stage.id).length === 0 && (
                             <div className="flex items-center justify-center h-24 text-muted-foreground text-sm italic">
                                 No candidates
                             </div>
                         )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function CandidateCard({ candidate, onMove }: { candidate: any, onMove: (id: string, stage: string) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group"
        >
            <Card className="hover:shadow-md transition-shadow cursor-default">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div>
                        <CardTitle className="text-sm font-medium">{candidate.name}</CardTitle>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                             <Mail className="w-3 h-3" /> {candidate.email}
                        </div>
                    </div>
                    {candidate.aiScore > 0 && (
                        <Badge variant={candidate.aiScore > 80 ? "default" : "secondary"} className={candidate.aiScore > 80 ? "bg-green-500 hover:bg-green-600" : ""}>
                            {candidate.aiScore}% Match
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    {candidate.aiSummary && (
                        <div className="text-xs bg-muted p-2 rounded mb-3 flex gap-2">
                             <Bot className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                             <span className="line-clamp-2">{candidate.aiSummary}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" title="View Resume">
                            <FileText className="w-3 h-3" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                              Move <ArrowRight className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STAGES.map(s => (
                                <DropdownMenuItem 
                                    key={s.id} 
                                    onClick={() => onMove(candidate.id, s.id)}
                                    disabled={candidate.stage === s.id}
                                >
                                    {s.label}
                                </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
