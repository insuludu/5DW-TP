
import { IUserData } from "@/interfaces";
import LoginStatus from "./loginStatus";

export default async function loginStatusWrapper()
{
    const res = await fetch('/account/validate');
    let isValid : boolean = res.ok;
    let data : IUserData | null = null;

    if (isValid)
        data = await res.json();

    return (
        <LoginStatus isValid={isValid} data={data}  />
    );
}