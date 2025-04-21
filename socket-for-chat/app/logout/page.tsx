"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isThereAnyToken } from "../services/utils";

export default function Page() {
    const history= useRouter();
    useEffect(()=>{
        if(isThereAnyToken(localStorage)){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        history.push('/');
    }, []);
    return<></>;
};