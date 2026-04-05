import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactElement } from "react";

export const LinkWithIcon= ({icon, text, to, addClassNames=""}: {icon: ReactElement, text: string, to: string, addClassNames?: string})=> {
    return <Link href={to} className={"flex justify-between bg-blue-700 text-white py-2 px-4 opacity-80 hover:opacity-100 transition-opacity duration-300 group " + addClassNames} >
        <div className="flex items-center gap-2">
            {icon}
            {text}
        </div>
        <ChevronRightIcon className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>;
};