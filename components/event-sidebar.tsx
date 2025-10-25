"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Trash2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"
import { isSameDay } from "@/lib/date-utils"

interface EventSidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  events: Event[]
  onAddEvent: (event: Omit<Event, "id">) => void
  onDeleteEvent: (eventId: string) => void
}

export function EventSidebar({ isOpen, onClose, selectedDate, events, onAddEvent, onDeleteEvent }: EventSidebarProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("09:00")
  const [duration, setDuration] = useState("60")
  const [color, setColor] = useState<Event["color"]>("accent")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !selectedDate) return

    const [hours, minutes] = time.split(":").map(Number)
    const eventDate = new Date(selectedDate)
    eventDate.setHours(hours, minutes, 0, 0)

    onAddEvent({
      title: title.trim(),
      date: eventDate,
      duration: Number.parseInt(duration),
      color,
    })

    setTitle("")
    setTime("09:00")
    setDuration("60")
    setColor("accent")
  }

  const selectedDateEvents = selectedDate ? events.filter((event) => isSameDay(event.date, selectedDate)) : []

  const colors: Array<{ value: Event["color"]; label: string; class: string }> = [
    { value: "accent", label: "Purple", class: "bg-accent" },
    { value: "chart-1", label: "Orange", class: "bg-chart-1" },
    { value: "chart-2", label: "Teal", class: "bg-chart-2" },
    { value: "chart-3", label: "Blue", class: "bg-chart-3" },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-card border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Select a date"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Team meeting, lunch, etc."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={cn(
                        "w-10 h-10 rounded-lg transition-all",
                        c.class,
                        color === c.value && "ring-2 ring-ring ring-offset-2 ring-offset-background",
                      )}
                      title={c.label}
                    >
                      <span className="sr-only">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Add Event
              </Button>
            </form>

            {selectedDateEvents.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Events</h3>
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg flex items-start justify-between gap-2",
                        event.color === "accent" && "bg-accent/10",
                        event.color === "chart-1" && "bg-chart-1/10",
                        event.color === "chart-2" && "bg-chart-2/10",
                        event.color === "chart-3" && "bg-chart-3/10",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              event.color === "accent" && "bg-accent",
                              event.color === "chart-1" && "bg-chart-1",
                              event.color === "chart-2" && "bg-chart-2",
                              event.color === "chart-3" && "bg-chart-3",
                            )}
                          />
                          <p className="font-medium text-sm text-foreground truncate">{event.title}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {event.date.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            • {event.duration} min
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete event</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
