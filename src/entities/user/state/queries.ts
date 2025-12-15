import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { userKeys } from "./keys";

interface UserData {
  user: {
    id: string;
    name: string;
    email: string;
  }
}


export async function fetchUserData(): Promise<UserData> {
  const response = await api.get<UserData>("/auth/me", {
    credentials: "include", // مهم جدًا لإرسال الكوكيز
  });
  
  console.log("Fetched user data:", response);
  return response;
}

export const useUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: fetchUserData,
    staleTime: 1000 * 60 * 5, // المستخدم مش رح يتغير كل دقيقة
    gcTime: 1000 * 60 * 10, // احفظ البيانات في الـ cache لـ 10 دقايق
    retry: 1, // حاول مرة واحدة عند الفشل
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false, // مهم جداً حتى ما يعيد الفetch بعد hydration
  });
};

