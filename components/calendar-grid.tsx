"use client"

import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"
import { isSameDay, isToday } from "@/lib/date-utils"

interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date | null
  events: Event[]
  onDateClick: (date: Date) => void
}

export function CalendarGrid({ currentDate, selectedDate, events, onDateClick }: CalendarGridProps) {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = []
  const prevMonthDays = firstDayOfMonth
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
  const prevMonthLastDay = prevMonth.getDate()

  // Previous month days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true,
    })
  }

  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false,
    })
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
        {weekDays.map((day) => (
          <div key={day} className="bg-muted px-4 py-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date)
          const isSelected = selectedDate && isSameDay(day.date, selectedDate)
          const isTodayDate = isToday(day.date)

          return (
            <button
              key={index}
              onClick={() => onDateClick(day.date)}
              className={cn(
                "bg-card min-h-[120px] p-2 text-left transition-colors hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
                !day.isCurrentMonth && "bg-muted/30 text-muted-foreground",
                isSelected && "ring-2 ring-accent ring-inset",
                isTodayDate && "bg-accent/10",
              )}
            >
              <div className="flex flex-col h-full">
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full mb-1",
                    isTodayDate && "bg-accent text-accent-foreground font-semibold",
                    !isTodayDate && day.isCurrentMonth && "text-foreground",
                    !isTodayDate && !day.isCurrentMonth && "text-muted-foreground",
                  )}
                >
                  {day.date.getDate()}
                </span>
                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs px-2 py-1 rounded truncate",
                        event.color === "accent" && "bg-accent text-accent-foreground",
                        event.color === "chart-1" && "bg-chart-1 text-white",
                        event.color === "chart-2" && "bg-chart-2 text-white",
                        event.color === "chart-3" && "bg-chart-3 text-white",
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
