"use client"

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { Check, X, Bell, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getDashboardData } from "@/app/actions/dashboard"

interface ActionItem {
  id: number
  title: string
  subtitle: string
  type: string
  content: string
}

export function ActionStack() {
  const [items, setItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
        const result = await getDashboardData();
        if (result.success && result.data) {
            setItems(result.data.actionItems as any);
        }
        setLoading(false);
    }
    fetchData();
  }, []);

  const removeCard = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  if (loading) {
      return (
          <div className="relative h-[400px] w-full max-w-sm mx-auto flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
      )
  }

  return (
    <div className="relative h-[400px] w-full max-w-sm mx-auto perspective-1000">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
        <Bell className="w-4 h-4" /> 
        Action Stack ({items.length})
      </h3>
      
      {items.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground">
          All caught up! 🎉
        </div>
      ) : (
        <div className="relative h-full w-full">
          <AnimatePresence>
            {items.map((item, index) => (
              <Card 
                key={item.id} 
                item={item} 
                index={index} 
                total={items.length} 
                onRemove={() => removeCard(item.id)} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function Card({ item, index, total, onRemove }: { item: ActionItem, index: number, total: number, onRemove: () => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgb(254, 202, 202)", "rgb(255, 255, 255)", "rgb(187, 247, 208)"]
  )

  const isFront = index === total - 1 // Last item is on top in this stacking context logic (reversed usually, but let's stick to simple z-index)
  // Actually, let's render items so last is on top.
  // Wait, map order: 0 is bottom, length-1 is top. Yes.

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
       // Approved
       onRemove()
    } else if (info.offset.x < -100) {
       // Denied
       onRemove()
    }
  }

  return (
    <motion.div
      style={{ 
        x, 
        rotate, 
        opacity,
        zIndex: index,
        backgroundColor: background
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 10 }}
      animate={{ scale: 1, y: 0, rotate: index % 2 === 0 ? 1 : -1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      whileTap={{ cursor: "grabbing" }}
      className={cn(
        "absolute top-0 left-0 h-80 w-full rounded-2xl border bg-card p-6 shadow-xl cursor-grab flex flex-col justify-between",
        !isFront && "pointer-events-none"
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.type}</span>
            <span className="text-xs text-muted-foreground">Now</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{item.subtitle}</p>
        <p className="text-lg font-medium">{item.content}</p>
      </div>

      <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
            <X className="w-4 h-4" /> Swipe left to Deny
        </div>
        <div className="flex items-center gap-1">
            Swipe right to Approve <Check className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  )
}
