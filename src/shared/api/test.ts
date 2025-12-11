import { cookies } from "next/headers"


export const tstFun = async () => {
    const cookiesSession = await cookies();
    console.log("🍪 Cookies object:", cookiesSession);
    const sessionCookie = cookiesSession.get("session");

    console.log("🍪 Session cookie value:", sessionCookie?.value);
    
    try{
      const payload = fetch("/api/auth/me",{
        method:"GET",
             headers: { 
                'Cookie': `session=${sessionCookie?.value}`  // ← اسم الـ cookie + قيمته
              },
        body:JSON.stringify({token:sessionCookie?.value})
      });  
      console.log(payload , "this is payload");
      
        return payload;

    }catch(error){}
}