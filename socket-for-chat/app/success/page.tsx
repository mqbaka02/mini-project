import Link from "next/link";

export default function Page() {
    return <>
        <div className="flex flex-col gap-8">
            <h1 className="text-xl text-center">Your account has been created !</h1>
            <p className="text-center">You can now <Link href={'/login'} className="hover:text-[#55f]">log in into your new account.</Link></p>
        </div>
    </>;
};