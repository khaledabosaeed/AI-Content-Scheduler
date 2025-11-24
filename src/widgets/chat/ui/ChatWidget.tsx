"use client";
import ChatInterface from "@/features/chat/ChatInterface";

/**
 * Chat Widget - The complete chat interface
 * This is a widget that composes the ChatInterface feature
 */
export default function ChatWidget() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    💬 محادثة مع الذكاء الاصطناعي
                </h1>
                <p className="text-gray-600">
                    استخدم الذكاء الاصطناعي لإنشاء محتوى احترافي لمواقع التواصل الاجتماعي
                </p>
            </div>

            <ChatInterface />
        </div>
    );
}
