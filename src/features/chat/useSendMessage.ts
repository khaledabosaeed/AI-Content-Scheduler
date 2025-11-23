import { useChatStore } from "@/shared/store/chat-store";

export function useSendMessage() {
  const { addUserMessage, addAssistantMessage, setIsSending, setError } =
    useChatStore();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    console.log(content);
    addUserMessage(content);
    setIsSending(true);
    setError(null);

    try {
      console.log("iii")
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send message");

      addAssistantMessage(data.response);
    } catch (err: any) {
      setError(err.message);
      console.log("Send Message Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage };
}
