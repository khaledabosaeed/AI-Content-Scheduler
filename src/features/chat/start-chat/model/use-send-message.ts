import { useChatStore } from "@/entities/chat";
import { useRef } from "react";

export function useSendMessage() {
  const { addUserMessage, appendAssistantMessage, setIsSending, setError, setController, cancelOngoingRequest } =
        useChatStore();

    // to contoll in the requset and cancel it 
    const controllerRef = useRef<AbortController | null>(null);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        setError(null);

        addUserMessage(content);
        setIsSending(true);

       const controller = new AbortController();
    setController(controller);

        try {
            const res = await fetch("/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: content }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send message");
            }

            // start stream
            const reader = res.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);

                // Split chunk into smaller pieces for smoother animation
                // This creates the "typing" effect
                for (let i = 0; i < chunk.length; i += 2) {
                    const miniChunk = chunk.slice(i, i + 2);
                    appendAssistantMessage(miniChunk);
                    // Small delay to create typing effect
                    // Adjust this value: smaller = faster, larger = slower

                    await new Promise(resolve => setTimeout(resolve, 20));
                }
            }
            setController(null);
        } catch (err: any) {
            if (err.name === "AbortError") {
                return;
            }
            setError(err.message);
            console.error("Send Message Error:", err);
        } finally {
            setIsSending(false);
            controllerRef.current = null;
        }
    };


    return { sendMessage, cancelOngoingRequest };
}
