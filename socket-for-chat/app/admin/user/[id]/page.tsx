"use client"

import { getUser } from "@/app/lib/users";
import { BASE_API_URL } from "@/app/register/page";
import { ChevronLeftIcon, UserCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser]= useState<{name: string, id: number, role: string}|null>(null);
    const {id}= useParams();
    useEffect(()=> {
		getUser(parseInt(id as string)).then((data)=> setUser(data)).catch((err: unknown)=> {
			console.log("" + err);
		});
    }, []);
    return <>
        <div className="flex flex-col gap-4 items-center justify-center w-full">
			<Link href="/admin/users" className="self-start flex gap-2" ><ChevronLeftIcon className="size-6" /> Back to users</Link>
			<div className="flex flex-col text-2xl gap-4">
				<UserCircleIcon />
				{user?.name}
			</div>
        </div>
    </>;
};