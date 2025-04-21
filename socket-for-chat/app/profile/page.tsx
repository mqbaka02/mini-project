"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkToken, isThereAnyToken } from "../services/utils";

export default function Page() {
    const history= useRouter();
    useEffect(()=> {
        if (!isThereAnyToken(localStorage)) {
            history.push('/login');
        } else {
            checkToken(localStorage.getItem('refreshToken')).then(answer => {
                if (!answer) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    history.push('/');
                }
            });
        }
    }, []);
    return<>
    <div className="flex items-center justify-center">
        Profile
    </div>
    </>
};