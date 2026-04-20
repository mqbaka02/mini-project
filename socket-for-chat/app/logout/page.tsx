"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BASE_API_URL } from "../register/page";
import Cookies from "js-cookie";

export default function Page() {
    const history= useRouter();
    useEffect(()=>{
        clearLocaltDatas();
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
export const clearLocaltDatas= () => {
    localStorage.removeItem('accessToken');
    Cookies.remove("accessToken")
    localStorage.removeItem('refreshToken');
    Cookies.remove("refreshToken")
    localStorage.removeItem('adminToken');
    Cookies.remove("adminToken");
    localStorage.removeItem('data');
};