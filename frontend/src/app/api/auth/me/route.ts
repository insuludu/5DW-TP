import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("authToken");

  if (!authCookie) {
    return NextResponse.json({ roles: [] });
  }

  const decoded: any = jwtDecode(authCookie.value);
  
  const roleClaim =
  decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  
  const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

  return NextResponse.json({ roles });
}