"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
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
            <div className="flex flex-col gap-2 w-full">
                <Link href={"/admin/users"} className="flex justify-between bg-blue-700 text-white py-2 px-4 opacity-80 hover:opacity-100 transition-opacity duration-300 group" >Users <ChevronRightIcon className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></Link>
                <Link href={"/admin/users"} className="flex justify-between bg-blue-700 text-white py-2 px-4 opacity-80 hover:opacity-100 transition-opacity duration-300 group" >Users <ChevronRightIcon className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></Link>
                <Link href={"/admin/users"} className="flex justify-between bg-blue-700 text-white py-2 px-4 opacity-80 hover:opacity-100 transition-opacity duration-300 group" >Users <ChevronRightIcon className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></Link>
                <Link href={"/admin/users"} className="flex justify-between bg-blue-700 text-white py-2 px-4 opacity-80 hover:opacity-100 transition-opacity duration-300 group" >Users <ChevronRightIcon className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></Link>
            </div>
        </div>
    </>;
};