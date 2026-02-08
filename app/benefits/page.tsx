"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Shield, Stethoscope, Eye, Cross, HeartPulse, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchBenefitPlans, fetchMyEnrollments, enrollUserInPlan } from "@/app/actions/benefits"

const TYPE_ICONS: Record<string, any> = {
  medical: Stethoscope,
  dental: Shield, // Approximation
  vision: Eye
}

export default function BenefitsPage() {
  const [plans, setPlans] = React.useState<any[]>([])
  const [enrollments, setEnrollments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [enrolling, setEnrolling] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      const p = await fetchBenefitPlans()
      const e = await fetchMyEnrollments()
      setPlans(p)
      setEnrollments(e)
      setLoading(false)
    }
    load()
  }, [])

  async function handleEnroll(planId: string) {
      setEnrolling(planId)
      await enrollUserInPlan(planId)
      // Refresh enrollments
      const e = await fetchMyEnrollments()
      setEnrollments(e)
      setEnrolling(null)
  }

  if (loading) return <div className="p-8">Loading...</div>

  // Group plans by type
  const groupedPlans = plans.reduce((acc: any, plan) => {
      if (!acc[plan.type]) acc[plan.type] = [];
      acc[plan.type].push(plan);
      return acc;
  }, {});

  const formatMoney = (cents: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const getTypeLabel = (type: string) => {
      switch(type) {
          case 'medical': return 'Medical Insurance';
          case 'dental': return 'Dental Coverage';
          case 'vision': return 'Vision Care';
          default: return type;
      }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Benefits Selection</h1>
        <p className="text-muted-foreground">Choose the plans that work best for you.</p>
      </header>

      <div className="space-y-10">
          {Object.keys(groupedPlans).map((type) => {
              const Icon = TYPE_ICONS[type] || HeartPulse
              return (
                  <section key={type} className="space-y-4">
                      <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <Icon className="w-6 h-6" />
                          </div>
                          <h2 className="text-2xl font-semibold">{getTypeLabel(type)}</h2>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groupedPlans[type].map((plan: any) => {
                              const isEnrolled = enrollments.some(e => e.planId === plan.id);
                              
                              return (
                                  <motion.div
                                    key={plan.id}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                      <Card className={`h-full flex flex-col ${isEnrolled ? 'border-primary ring-1 ring-primary' : ''}`}>
                                          <CardHeader>
                                              <div className="flex justify-between items-start">
                                                  <Badge variant="outline">{plan.provider}</Badge>
                                                  {isEnrolled && <Badge className="bg-primary text-primary-foreground">Enrolled</Badge>}
                                              </div>
                                              <CardTitle className="mt-2 text-xl">{plan.name}</CardTitle>
                                              <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
                                          </CardHeader>
                                          <CardContent className="flex-1">
                                              <div className="mt-4">
                                                  <div className="text-3xl font-bold">{formatMoney(plan.costEmployee)}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                                  <div className="text-xs text-muted-foreground">Employer pays {formatMoney(plan.costEmployer)}</div>
                                              </div>
                                          </CardContent>
                                          <CardFooter>
                                              <Button 
                                                className="w-full" 
                                                variant={isEnrolled ? "outline" : "default"}
                                                disabled={isEnrolled || enrolling === plan.id}
                                                onClick={() => handleEnroll(plan.id)}
                                              >
                                                  {isEnrolled ? (
                                                      <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Selected</span>
                                                  ) : (
                                                      enrolling === plan.id ? "Enrolling..." : "Select Plan"
                                                  )}
                                              </Button>
                                          </CardFooter>
                                      </Card>
                                  </motion.div>
                              )
                          })}
                      </div>
                  </section>
              )
          })}
      </div>
    </div>
  )
}
