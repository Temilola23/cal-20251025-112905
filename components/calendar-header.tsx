"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onNewEvent: () => void
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onNewEvent,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-foreground">Cal</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPreviousMonth} className="h-8 w-8 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth} className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
            <Button variant="outline" onClick={onToday} className="h-8 px-3 text-sm bg-transparent">
              Today
            </Button>
          </div>
          <h2 className="text-xl font-medium text-foreground">{monthYear}</h2>
        </div>
        <Button onClick={onNewEvent} className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>
    </header>
  )
}
