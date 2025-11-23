import { cookies } from "next/headers";
import { AuthCookieName } from "@/constants";

export class AuthHelper {
    static async isAuthenticated(): Promise<boolean> {
        try {
            const cookieStore = await cookies();
            const authCookie = cookieStore.get(AuthCookieName);
            
            if (!authCookie?.value) {
                return false;
            }

            const response = await fetch(`${process.env.API_BACKEND_URL}/api/account/status`, {
                method: "GET",
                headers: {
                    'Cookie': `${AuthCookieName}=${authCookie.value}`,
                },
            });

            return response.ok;
        } catch (error) {
            console.error("Erreur lors de la vérification d'authentification:", error);
            return false;
        }
    }
}