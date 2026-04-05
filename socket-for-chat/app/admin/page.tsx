"use client";

import { ChevronRightIcon, CogIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactElement } from "react";
import { LinkWithIcon } from "../components/linkWIthIcon";

export default function Page() {
    
    return <>
        <div className="flex flex-col gap-4 items-center justify-center">
            <div className="text-xl">
                This is the admin page.<br/>No one, I tel you, no one is allowed here but the admin.
            </div>
            <div className="flex flex-col gap-2 w-full">
                <LinkWithIcon icon={<UsersIcon className="size-6" />} text="Users" to="/admin/users" />
                <LinkWithIcon icon={<CogIcon className="size-6" />} text="Settings" to="#" />
            </div>
        </div>
    </>;
};
