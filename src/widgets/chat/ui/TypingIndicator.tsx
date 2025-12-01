"use client";
import { Loader2 } from "lucide-react";

export default function TypingIndicator() {
    return (
        <div className="w-full flex justify-start animate-fadeIn">
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/30">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl rounded-tl-md shadow-md">
                    <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
