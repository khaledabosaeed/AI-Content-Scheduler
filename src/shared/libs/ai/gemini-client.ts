import { GoogleGenerativeAI } from "@google/generative-ai";


// التحقق من وجود API Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


/**
 * 
 * 
 * إرسال prompt للـ AI والحصول على رد
 */

export async function generateContentStream(prompt: string): Promise<ReadableStream> {
  try {
    // select the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // generate content
    // to get the result in straming way !
    const result = await model.generateContentStream(prompt);


    // get stream response from result

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    })
    return stream;


  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Failed to connect to artificial intelligence: ${error.message}`);
  }
}

/**
 * Prompts معدة مسبقاً لجودة أفضل
 */

export const AIPrompts = {
  socialMediaPost: (topic: string, platform: "twitter" | "facebook") => {
    const charLimit = platform === "twitter" ? "280 حرف" : "500 حرف";
    return `اكتب منشور احترافي على ${platform} عن "${topic}". 
    المتطلبات:
    - الطول: ${charLimit}
    - أسلوب جذاب ومشوق
    - إضافة إيموجيات مناسبة
    - إضافة 3-5 هاشتاجات ذات صلة
    - باللغة العربية`;
  },

  improveContent: (content: string) => {
    return `حسّن هذا المحتوى ليكون أكثر احترافية وجاذبية:
    "${content}"
    
    المتطلبات:
    - الحفاظ على المعنى الأصلي
    - تحسين الصياغة
    - إضافة إيموجيات مناسبة`;
  },

  generateHashtags: (content: string) => {
    return `اقترح 5-7 هاشتاجات مناسبة لهذا المحتوى:
    "${content}"
    
    يجب أن تكون الهاشتاجات:
    - ذات صلة بالمحتوى
    - شائعة ومستخدمة
    - باللغة العربية والإنجليزية`;
  },
};
