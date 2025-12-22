"use client";

import { usePostsStore } from "@/entities/posts";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";



export function ScheduleModalContainer() {


  const {isScheduleOpen  , scheduleInitialContent  , closeScheduleModal , fetchPosts}= usePostsStore()

  const handleConfirm = async () => {
    closeScheduleModal();
    await fetchPosts();
  };

  if (!isScheduleOpen) return null;

  return (
    <ScheduleModal
      open={isScheduleOpen}
      onOpenChange={closeScheduleModal}
      initialContent={scheduleInitialContent}
      onConfirm={handleConfirm}
    />
  );
}
