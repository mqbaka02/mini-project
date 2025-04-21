"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isUserLoggedIn } from "../layout";

export default function Page() {
    const history= useRouter();
    useEffect(()=>{
        if(isUserLoggedIn()){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        history.push('/');
    }, []);
    return<></>;
};