"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Download, DollarSign, Calendar, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchMyCompensation, fetchMyPayslips } from "@/app/actions/payroll"

export default function PayrollPage() {
  const [comp, setComp] = React.useState<any>(null)
  const [payslips, setPayslips] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      const c = await fetchMyCompensation()
      const p = await fetchMyPayslips()
      setComp(c)
      setPayslips(p)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  return (
    <div className="p-8 h-full space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Compensation & Payroll</h1>
        <p className="text-muted-foreground">Transparent, real-time view of your earnings.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Total Compensation
                  </CardTitle>
                  <CardDescription>Your current annual base salary</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="text-5xl font-bold tracking-tighter text-primary">
                      {comp ? formatMoney(comp.amount) : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                      Effective since {comp?.effectiveDate}
                  </p>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Next Payday
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold">Mar 31</div>
                  <p className="text-sm text-muted-foreground">In 14 days</p>
                  <div className="mt-4 pt-4 border-t text-sm">
                      Estimated Net: <span className="font-mono font-medium">{payslips.length > 0 ? formatMoney(payslips[0].netPay) : "N/A"}</span>
                  </div>
              </CardContent>
          </Card>
      </div>

      <div>
          <h2 className="text-xl font-semibold mb-4">Payslip History</h2>
          <div className="space-y-4">
              {payslips.map((slip) => (
                  <motion.div
                    key={slip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold">{slip.periodEnd}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {slip.periodStart} - {slip.periodEnd}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm text-muted-foreground">Gross</div>
                                    <div className="font-mono">{formatMoney(slip.grossPay)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Net Pay</div>
                                    <div className="font-bold text-lg text-primary">{formatMoney(slip.netPay)}</div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                  </motion.div>
              ))}
          </div>
      </div>
    </div>
  )
}
