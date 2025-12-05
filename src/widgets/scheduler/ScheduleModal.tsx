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
  onConfirm: (date: Date, platform: string, content: string) => void; // أضفنا المحتوى
  initialContent: string; // المحتوى الأصلي من الرسالة
}

export default function ScheduleModal({ open, onOpenChange, onConfirm, initialContent }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState<string>("12:00");
  const [platform, setPlatform] = React.useState("twitter");
  const [content, setContent] = React.useState(initialContent); // محتوى قابل للتعديل

  const formatFullDate = () => {
    if (!selectedDate) return "اختر التاريخ والوقت";
    return `${format(selectedDate, "yyyy-MM-dd")} — ${selectedTime}`;
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours, minutes, 0);

    onConfirm(finalDate, platform, content); // إرسال التاريخ + المنصة + المحتوى
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[430px] rounded-2xl p-6 shadow-2xl border border-gray-200/60 bg-white/90 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            تحديد موعد نشر المنشور
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* تعديل محتوى الـ AI */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-sm">محتوى المنشور</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={4}
            />
          </div>

          {/* اختيار المنصة */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-sm">منصة النشر</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="twitter">X (Twitter)</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          {/* اختيار التاريخ */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-sm">التاريخ</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border-gray-300",
                    !selectedDate && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-indigo-600" />
                  {selectedDate ? format(selectedDate, "PPP") : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white rounded-xl shadow-xl">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* اختيار الوقت */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-sm">الوقت</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-indigo-600" />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 rounded-xl border text-sm text-gray-700">
            <span className="font-medium">الموعد المختار:</span>
            <br />
            <span>{formatFullDate()}</span>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleConfirm}
            disabled={!selectedDate}
            className="w-full py-2.5 text-base bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50"
          >
            حفظ الموعد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
