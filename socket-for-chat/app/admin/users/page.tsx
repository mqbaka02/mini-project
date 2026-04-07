"use client"

import { LinkWithIcon } from "@/app/components/linkWIthIcon";
import { getUsers, userDetails } from "@/app/lib/users";
import { BASE_API_URL } from "@/app/register/page";
import { UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Page() {
	const [users, setUsers] = useState<userDetails[]>([]);
	useEffect(() => {
		getUsers().then(response => {
			setUsers(response);
		}).catch (err=> {
			console.error(err);
		});
	}, []);
	return <>
		<div className="flex flex-col gap-4 items-center justify-center w-full">
			<h1 className="text-xl">
				Users Page
			</h1>
			<div className="flex flex-col gap-4 w-full">
				{
					users.map(user => <LinkWithIcon icon={<UserIcon className="size-6" />} text={user.name} to={`/admin/user/${user.id}`} key={user.id} addClassNames={user.role === "admin" ? "border-l-4 border-red-500" : undefined} />)
				}
			</div>
		</div>
	</>;
};