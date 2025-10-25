"use client"

import { useState } from "react"
import { CalendarHeader } from "@/components/calendar-header"
import { CalendarGrid } from "@/components/calendar-grid"
import { EventSidebar } from "@/components/event-sidebar"
import type { Event } from "@/lib/types"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(2025, 9, 28, 10, 0),
      duration: 60,
      color: "accent",
    },
    {
      id: "2",
      title: "Project Review",
      date: new Date(2025, 9, 30, 14, 0),
      duration: 90,
      color: "chart-1",
    },
  ])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsSidebarOpen(true)
  }

  const handleAddEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents([...events, newEvent])
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onNewEvent={() => {
            setSelectedDate(new Date())
            setIsSidebarOpen(true)
          }}
        />
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          onDateClick={handleDateClick}
        />
      </div>
      <EventSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedDate={selectedDate}
        events={events}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  )
}
