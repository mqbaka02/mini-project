"use client";
import { useEffect } from "react";
import { isUserLoggedIn } from "../layout";
import { useRouter } from "next/navigation";

export default function Page() {
    const history= useRouter();
    useEffect(()=> {
        if (!isUserLoggedIn()) {
            history.push('/login');
        }
    }, []);
    return<>
    <div className="flex items-center justify-center">
        Profile
    </div>
    </>
};