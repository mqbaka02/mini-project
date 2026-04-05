"use client"

import { LinkWithIcon } from "@/app/components/linkWIthIcon";
import { BASE_API_URL } from "@/app/register/page";
import { UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Page() {
    const [users, setUsers]= useState<{name: string, id: number, role: string}[]>([]);
    useEffect(()=> {
      try {
        fetch(BASE_API_URL + "/users", {
          method: "GET",
          headers: { "Content-type": "application/json" },
          credentials: "include",
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            if (data.data) setUsers(data.data);
        });
      } catch (err: unknown) {
        console.error("Error while trying to Fetch users.", err);
      }
    }, []);
    return <>
        <div className="flex flex-col gap-4 items-center justify-center w-full">
            <h1 className="text-xl">
                Users Page
            </h1>
            <div className="flex flex-col gap-4 w-full">
                {
                    users.map(user=> <LinkWithIcon icon={<UserIcon className="size-6" />} text={user.name} to={`/admin/user/${user.id}`} key={user.id} addClassNames={user.role==="admin"? "border-l-4 border-red-500": undefined} />)
                }
            </div>
        </div>
    </>;
};