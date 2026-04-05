"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BASE_API_URL } from "../register/page";

export default function Page() {
    const history= useRouter();
    useEffect(()=>{
        clearLocatDatas();
        try {
            fetch(BASE_API_URL + '/logout', {
                method: 'GET',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
            }).then(response=> {
                return response.json();
            }).then(()=> {
                history.push('/');
            });
        } catch (err: unknown) {
            console.error("Error while trying to log out.", err);
        };
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