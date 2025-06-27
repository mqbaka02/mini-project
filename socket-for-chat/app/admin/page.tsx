"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    // const history= useRouter();
    // useEffect(()=> {
    //     if(!localStorage.getItem('adminToken')) {
    //         history.push('/');
    //     }
    // });
    return <>
        <div className="flex flex-col gap-4 items-center justify-center">
            <div className="text-xl">
                This is the admin page.<br/>No one, I tel you, no one is allowed here but the admin.
            </div>
        </div>
    </>;
};