"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, Plane, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns"
import { submitTimeOffRequest } from "@/app/actions/time-off"

export default function TimeOffPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<{start: Date | null, end: Date | null}>({ start: null, end: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  // Fill in empty days at start of month
  const startDay = days[0].getDay()
  const emptyDays = Array(startDay).fill(null)

  const handleDateClick = (day: Date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        setSelectedRange({ start: day, end: null })
    } else {
        // Simple logic: if clicked before start, make it start. If after, make it end.
        if (day < selectedRange.start) {
            setSelectedRange({ start: day, end: selectedRange.start })
        } else {
            setSelectedRange({ ...selectedRange, end: day })
        }
    }
  }

  const isSelected = (day: Date) => {
    if (!selectedRange.start) return false
    if (selectedRange.end) {
        return day >= selectedRange.start && day <= selectedRange.end
    }
    return isSameDay(day, selectedRange.start)
  }

  const handleSubmit = async () => {
    if (!selectedRange.start) return;
    
    setIsSubmitting(true);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('startDate', format(selectedRange.start, 'yyyy-MM-dd'));
    formData.append('endDate', format(selectedRange.end || selectedRange.start, 'yyyy-MM-dd'));
    formData.append('type', 'vacation'); // Mocking type selection for now
    formData.append('reason', 'Time off via FlowState');

    const result = await submitTimeOffRequest(null, formData);
    
    setIsSubmitting(false);
    if (result.success) {
        setSuccessMessage(result.message);
        // Reset selection after delay
        setTimeout(() => {
            setSelectedRange({ start: null, end: null });
            setSuccessMessage(null);
        }, 3000);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Time Off</h1>
            <div className="flex gap-2">
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plane className="w-4 h-4" /> 12 Days Vacation
                </div>
                <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 5 Days Sick
                </div>
            </div>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-muted rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-muted rounded-full">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S','M','T','W','T','F','S'].map(d => (
                        <div key={d} className="text-xs font-medium text-muted-foreground py-2">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                    {days.map((day) => {
                        const selected = isSelected(day)
                        return (
                            <button 
                                key={day.toString()}
                                onClick={() => handleDateClick(day)}
                                className={cn(
                                    "h-10 w-full rounded-md flex items-center justify-center text-sm relative transition-all",
                                    isToday(day) && !selected && "text-primary font-bold bg-primary/10",
                                    selected ? "bg-primary text-primary-foreground shadow-md scale-105 z-10" : "hover:bg-muted"
                                )}
                            >
                                {format(day, 'd')}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="bg-muted/30 p-6 w-full md:w-80 border-t md:border-t-0 md:border-l flex flex-col justify-center">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Request Details</h3>
                
                {selectedRange.start ? (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Dates</div>
                            <div className="text-lg font-medium">
                                {format(selectedRange.start, 'MMM d')} 
                                {selectedRange.end ? ` - ${format(selectedRange.end, 'MMM d')}` : ''}
                            </div>
                        </div>

                         <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Type (Auto-detected)</div>
                            <div className="text-lg font-medium flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 p-1 rounded">🏖️</span> Vacation
                            </div>
                        </div>

                        {successMessage ? (
                            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium animate-in fade-in zoom-in">
                                {successMessage}
                            </div>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground text-sm">
                        Select dates on the calendar to start a request.
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
