"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const history= useRouter();
    useEffect(()=>{
        clearLocatDatas();
        history.push('/');
    }, []);
    return<></>;
};

/**
 * Deletes all user data related to the site from localStorage.
 */
export const clearLocatDatas= () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('data');
};