import { log } from "console";
import { getAuthToken } from "../libs/auth/cookies";



export const  getUserServer = async () => {

    const cook = getAuthToken();
    try {   
        const userData = await fetch("apt/auth/me", {
            method: "GET",
            headers: { cookie: cook || "" },
            credentials: cook ? "include" : "same-origin",

        });
        if (!userData.ok) {
            console.error("❌ Failed to fetch user data on server:", userData.statusText);
            return null;
        }
        const data = await userData.json();
        log("Fetched user data on server:", data);
        return data;
    }catch (error) {
        console.error("❌ Failed to fetch user data on server:", error);
        return null;
    }
}