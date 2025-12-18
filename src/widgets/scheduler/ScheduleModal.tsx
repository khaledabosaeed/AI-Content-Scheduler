"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button"; 
import { Calendar } from "@/shared/components/ui/calendar"; 
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/components/ui/popover";
import { cn } from "@/shared/libs/chadcn/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date | null, platform: string, content: string) => void;
  initialContent: string;
}

export default function ScheduleModal({ open, onOpenChange, onConfirm, initialContent }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState<string>("12:00");
  const [platform, setPlatform] = React.useState("twitter");
  const [content, setContent] = React.useState(initialContent);

  const formatFullDate = () => {
    if (!selectedDate) return "No date selected";
    return `${format(selectedDate, "yyyy-MM-dd")} — ${selectedTime}`;
  };

  const handleConfirm = () => {
    if (!content.trim() || !platform.trim()) return;

    let finalDate: Date | null = null;
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      finalDate = new Date(selectedDate);
      finalDate.setHours(hours, minutes, 0);
    }

    onConfirm(finalDate, platform, content);
    onOpenChange(false);
  };

  const isDisabled = !content.trim() || !platform.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[430px] rounded-2xl p-6 shadow-2xl border border-[hsl(var(--border)/60)] bg-[hsl(var(--paper)/90)] backdrop-blur" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[hsl(var(--foreground))]">
            Schedule Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Post Content */}
          <div className="flex flex-col gap-2">
            <label className="text-[hsl(var(--foreground))] font-medium text-sm">Post Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-[hsl(var(--border))] rounded-xl p-2 focus:ring-2 focus:ring-[hsl(var(--primary))] focus:outline-none text-[hsl(var(--foreground))] bg-[hsl(var(--paper))]"
              rows={4}
              placeholder="Enter your post content..."
            />
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-2">
            <label className="text-[hsl(var(--foreground))] font-medium text-sm">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-[hsl(var(--border))] rounded-xl p-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] bg-[hsl(var(--paper))] text-[hsl(var(--foreground))]"
            >
              <option value="">Select platform</option>
              <option value="twitter">X (Twitter)</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[hsl(var(--foreground))] font-medium text-sm">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border-[hsl(var(--border))]",
                    !selectedDate && "text-[hsl(var(--text-disabled))]",
                    "bg-[hsl(var(--paper))]"
                  )}
                >
                  <CalendarIcon className="ml-2 h-5 w-5 text-[hsl(var(--primary))]" />
                  {selectedDate ? format(selectedDate, "PPP") : "Optional - choose a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-[hsl(var(--paper))] rounded-xl shadow-xl">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <label className="text-[hsl(var(--foreground))] font-medium text-sm">Time</label>
            <div className="relative">
              <Clock className="absolute right-3 top-3 h-5 w-5 text-[hsl(var(--primary))]" />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-[hsl(var(--border))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:outline-none bg-[hsl(var(--paper))] text-[hsl(var(--foreground))]"
              />
            </div>
          </div>

          <div className="px-4 py-3 bg-[hsl(var(--elevated))] rounded-xl border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))]">
            <span className="font-medium">Selected Schedule:</span>
            <br />
            <span>{formatFullDate()}</span>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
            className={`w-full py-2.5 text-base rounded-xl text-[hsl(var(--primary-foreground))] ${
              isDisabled
                ? "bg-[hsl(var(--muted))] cursor-not-allowed"
                : "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--action-hover))]"
            }`}
          >
            Save Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
