import { cookies } from "next/headers"


export const tstFun = async () => {
    const cookiesSession = await cookies();
    // console.log("🍪 Cookies object:", cookiesSession);
    const sessionCookie = cookiesSession.get("session");
    // console.log("🍪 Session cookie value:", sessionCookie?.value);
    try{
   const res = await fetch(`/api/users/me`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${sessionCookie}`,
        },
        // cache: "no-store", // Always fetch fresh data  
      });
          if (!res.ok) {
      console.log("this is the error ");
      return null;
    }
      const data = await res.json();
      // Backend returns: { data: { user: {...} } }
      // Extract user to match the same structure as client-side  
    const user = data?.data;
        return user;

    }catch(error){
      console.error("Server-side auth error:", error);
    return null;
    }
}