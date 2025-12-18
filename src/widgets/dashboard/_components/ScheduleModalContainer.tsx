"use client";

import { usePostsStore } from "@/entities/posts";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";



export function ScheduleModalContainer() {
  const isOpen = usePostsStore((state) => state.isScheduleOpen);
  const initialContent = usePostsStore((state) => state.scheduleInitialContent);
  const closeScheduleModal = usePostsStore((state) => state.closeScheduleModal);
  const fetchPosts = usePostsStore((state) => state.fetchPosts);

  const handleConfirm = async () => {
    closeScheduleModal();
    await fetchPosts();
  };

  if (!isOpen) return null;

  return (
    <ScheduleModal
      open={isOpen}
      onOpenChange={closeScheduleModal}
      initialContent={initialContent}
      onConfirm={handleConfirm}
    />
  );
}
