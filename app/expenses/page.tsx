"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Receipt, Coffee, Plane, ShoppingBag, Plus, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchMyExpenses, submitExpense, approveUserExpense, rejectUserExpense } from "@/app/actions/expenses"

const CATEGORY_ICONS: Record<string, any> = {
  meals: Coffee,
  travel: Plane,
  supplies: ShoppingBag,
  default: Receipt
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      const data = await fetchMyExpenses()
      setExpenses(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCreateMock() {
      // Create a random expense for testing
      const newExp = await submitExpense({
          amount: Math.floor(Math.random() * 5000) + 1000,
          category: 'meals',
          merchant: 'Lunch Place',
          description: 'Team Lunch'
      })
      setExpenses(prev => [newExp, ...prev])
  }

  async function handleApprove(id: string) {
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e))
      await approveUserExpense(id)
  }

  async function handleReject(id: string) {
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e))
      await rejectUserExpense(id)
  }

  if (loading) return <div className="p-8">Loading...</div>

  const formatMoney = (cents: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground">Track and approve team spend.</p>
        </div>
        <Button onClick={handleCreateMock} className="gap-2">
            <Plus className="w-4 h-4" /> New Expense
        </Button>
      </header>

      <div className="space-y-4">
          <AnimatePresence mode="popLayout">
              {expenses.map((expense) => {
                  const Icon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.default
                  return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                      >
                          <Card>
                              <CardContent className="p-6 flex items-center gap-6">
                                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                                      expense.status === 'approved' ? 'bg-green-100 text-green-600' : 
                                      expense.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                                  }`}>
                                      <Icon className="w-6 h-6" />
                                  </div>
                                  
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                          <div>
                                              <h3 className="font-semibold text-lg">{expense.merchant}</h3>
                                              <p className="text-sm text-muted-foreground">{expense.description}</p>
                                          </div>
                                          <div className="text-right">
                                              <div className="font-bold text-lg">{formatMoney(expense.amount)}</div>
                                              <Badge variant={expense.status === 'pending' ? 'outline' : expense.status === 'approved' ? 'default' : 'destructive'}>
                                                  {expense.status}
                                              </Badge>
                                          </div>
                                      </div>
                                      
                                      {expense.status === 'pending' && (
                                          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                              <Button variant="ghost" size="sm" onClick={() => handleReject(expense.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                  Reject
                                              </Button>
                                              <Button size="sm" onClick={() => handleApprove(expense.id)} className="bg-green-600 hover:bg-green-700 text-white">
                                                  Approve
                                              </Button>
                                          </div>
                                      )}
                                  </div>
                              </CardContent>
                          </Card>
                      </motion.div>
                  )
              })}
          </AnimatePresence>
          {expenses.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  No expenses found.
              </div>
          )}
      </div>
    </div>
  )
}
