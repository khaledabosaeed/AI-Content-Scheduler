import { useChatStore } from "@/entities/chat";
import { useRef } from "react";

export function useSendMessage() {
  const {
    addUserMessage,
    appendAssistantMessage,
    setIsSending,
    setError,
    setController,
    cancelOngoingRequest,
    saveCurrentSession,
  } = useChatStore();

  // to control the request and cancel it
  const controllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);

    addUserMessage(content);

    setIsSending(true);

    // Create empty assistant message for skeleton loading
    appendAssistantMessage("");

    const controller = new AbortController();
    setController(controller);
    controllerRef.current = controller;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send message");
      }

      // 2️⃣ start stream
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // Split chunk into smaller pieces for smoother animation
        for (let i = 0; i < chunk.length; i += 2) {
          const miniChunk = chunk.slice(i, i + 2);
          appendAssistantMessage(miniChunk);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      }
      console.log("✅ stream finished, saving session...");

      if (saveCurrentSession) {
        await saveCurrentSession();
      }
      console.log("✅ session saved to DB + store");

      setController(null);
      controllerRef.current = null;
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }

      console.error("Send Message Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, cancelOngoingRequest };
}
