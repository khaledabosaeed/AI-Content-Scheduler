  "use client";

  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
  import { Button } from "@/shared/components/ui/button"; 
  import { Calendar } from "@/shared/components/ui/calendar"; 
  import { Popover, PopoverTrigger, PopoverContent } from "@/shared/components/ui/popover";
  import { cn } from "@/shared/libs/chadcn/utils";
  import { format } from "date-fns";
  import { CalendarIcon, ChevronDown, Clock } from "lucide-react";
  import { useEffect, useState } from "react";
  import { Post } from "@/entities/posts";

  interface ScheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (date: Date | null, platform: string, content: string) => void;
    initialContent: string;
    post?:Post  
  }

  export default function ScheduleModal({ open, onOpenChange, onConfirm, initialContent, post }: ScheduleModalProps) {

    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>("12:00");
    const [platform, setPlatform] = useState("facebook");
    const [content, setContent] = useState(initialContent);
    const [postStatues , setPostStatues]= useState('');


    const formatFullDate = () => {
      if (!selectedDate) return "No date selected";
      return `${format(selectedDate, "yyyy-MM-dd")} — ${selectedTime}`;
    };

    useEffect(()=>{
      console.log("this befor ");
      
    if(!post) return;
    setPostStatues(post.status)
    console.log(post.status , "from the effect side");

    },[])

    console.log(postStatues , 'this is the status for the posts');
    
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
            <div  className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Platform
              </label>

            <div className="relative">
            {/* Icon */}
      <ChevronDown
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          h-4 w-4
          text-[hsl(var(--primary))]
          pointer-events-none
        "
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="
          w-full
          appearance-none
          rounded-xl
          border border-[hsl(var(--border))]
          bg-[hsl(var(--paper))]
          px-4 py-2.5
          pr-10
          text-sm
          text-[hsl(var(--foreground))]
          shadow-sm

          transition-all duration-200
          hover:border-[hsl(var(--primary))]

          focus:outline-none
          focus:ring-2
          focus:ring-[hsl(var(--primary))]
          focus:ring-offset-2
          focus:ring-offset-[hsl(var(--paper))]
        "
      >
        <option value="" disabled>
          Select platform
        </option>
        <option value="facebook">Facebook</option>
      </select>
    </div>
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
                    <CalendarIcon className="ml-2 h-5 w-5 text-[hsl(var(--primary))] hover:text-white" />
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
        <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal rounded-xl border-[hsl(var(--border))]",
          !selectedTime && "text-[hsl(var(--text-disabled))]",
          "bg-[hsl(var(--paper))]"
        )}
      >
        <Clock className="ml-2 h-5 w-5 text-[hsl(var(--primary))]" />
        {selectedTime || "Optional - choose a time"}
      </Button>
    </PopoverTrigger>

    <PopoverContent className="p-4 bg-[hsl(var(--paper))] rounded-xl shadow-xl w-56">
      <input
        type="time"
        value={selectedTime || ""}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="
          w-full rounded-lg border px-3 py-2
          bg-[hsl(var(--paper))]
          border-[hsl(var(--border))]
          focus:outline-none focus:ring-2 focus:ring-primary  
        "
      />
              </PopoverContent>
        </Popover>

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
                  : "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--orimary))]"
              }`}
            >{postStatues === "published"
              ? "Resave the post"
              : "Save the post"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
