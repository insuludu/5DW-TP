"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { logoutUser } from "@/actions/auth";
import { IUserData } from "@/interfaces";

interface LoginStatusProps {
    isValid: boolean;
    data: IUserData | null;
}

export default function LoginStatus({ isValid, data }: LoginStatusProps) {
    const router = useRouter();

    const handleLogout = async () => {
        // await logoutUser(); 
        
        router.refresh(); 
        router.push('/');
    };
    
    if (isValid) {
        return (
            <>
                <div className="d-flex align-items-center">
                    <span className="text-dark me-2">Bonjour, {data?.FirstName}</span>
                    <button onClick={handleLogout} className="btn btn-outline-danger">
                        Déconnexion
                    </button>
                </div>
            </>
        );
    } else {
        return (
            <Link href="account/login" className="btn btn-outline-success">
                Connexion
            </Link>
        );
    }
}