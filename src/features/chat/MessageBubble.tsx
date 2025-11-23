import { useSaveAsPost } from "./useSaveAsPost";

export default function MessageBubble({ message, previousMessage }: any) {
  const { saveAsPost } = useSaveAsPost();

  const isAI = message.role === "assistant";

  const handleSave = async () => {
    await saveAsPost({
      prompt: previousMessage?.content,
      content: message.content,
      platform: "Instagram",
    });
    alert("Saved as Post!");
  };

  return (
    <div className={`w-full flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`p-3 rounded-lg max-w-[70%] text-sm shadow-md
${isAI ? "bg-gray-200" : "bg-blue-500 text-white"}`}
      >
        <p>{message.content}</p>

        {isAI && (
          <button
            onClick={handleSave}
            className="mt-2 text-xs bg-black text-white px-2 py-1 rounded"
          >
            Save as Post
          </button>
        )}
      </div>
    </div>
  );
}
