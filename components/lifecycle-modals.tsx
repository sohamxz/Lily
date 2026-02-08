"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { submitPromotion, submitTermination } from "@/app/actions/lifecycle"

// A simple reusable modal component since I didn't implement Dialog from Shadcn fully yet
function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md"
            >
                {children}
            </motion.div>
        </div>
    )
}

export function PromotionModal({ userId, userName, onClose }: { userId: string, userName: string, onClose: () => void }) {
    const [title, setTitle] = React.useState("")
    const [salary, setSalary] = React.useState("")
    const [reason, setReason] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        // Convert salary to cents
        await submitPromotion(userId, title, parseInt(salary) * 100, reason)
        setLoading(false)
        onClose()
        // Ideally show toast
        alert(`Successfully promoted ${userName}!`)
    }

    return (
        <Modal onClose={onClose}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Promote {userName}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Job Title</label>
                            <input 
                                className="w-full rounded-md border p-2" 
                                required 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="e.g. Senior Manager"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Annual Salary (USD)</label>
                            <input 
                                className="w-full rounded-md border p-2" 
                                required 
                                type="number"
                                value={salary} 
                                onChange={e => setSalary(e.target.value)} 
                                placeholder="150000"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Reason</label>
                            <textarea 
                                className="w-full rounded-md border p-2" 
                                required 
                                value={reason} 
                                onChange={e => setReason(e.target.value)} 
                                placeholder="Why do they deserve this?"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Promoting..." : "Confirm Promotion"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    )
}
