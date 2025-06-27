"use client";
import '@/app/ui/global.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isThereAnyToken } from './services/utils';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userLoggedIn, setUserLoggedIn]= useState<boolean>(false);
    const pathname= usePathname();

    useEffect(()=> {
        setUserLoggedIn(isThereAnyToken(window.localStorage));
    }, [pathname]);

    return (
        <html lang="en">
            <body className='h-full min-h-[100vh] flex flex-col'>
                <div className="h-full flex flex-col gap-0 justify-between grow">
                    <HeaderBase hasUser={userLoggedIn} />
                    <div className="w-full max-w-[30rem] mx-auto">
                        {children}
                    </div>
                    <Footer />
                </div>
            </body>
        </html>
    );
}

const HeaderBase= ({hasUser}: {hasUser: boolean})=> {
    return <header>
        <div className="w-full py-2">
            <div className="w-[97%] max-w-[63rem] flex justify-between mx-auto">
                <Link className="text-3 font-semibold" href={"/"}>Basic Logo</Link>
                <div className="flex gap-4">
                    {hasUser ?
                        <>
                            <Link href={"/profile"} className='hover:text-[#55f]'>Profile</Link>
                            <Link href={"/admin"} className='hover:text-[#55f]'>Admin</Link>
                            <Link href={"/logout"} className='hover:text-[#55f]'>Log out</Link>
                        </>
                        :
                        <>
                            <Link href={"/login"} className='hover:text-[#55f]'>Log in</Link>
                            <Link href={"/register"} className='hover:text-[#55f]'>Register</Link>
                        </>
                    }
                </div>
            </div>
        </div>
    </header>;
};

const Footer = () => {
    return <div className="w-full bg-[#333] py-2">
        <div className="text-white w-[97%] max-w-[63rem] mx-auto flex justify-between">
            <Link className="text-3 font-semibold" href={"/"}>Basic Logo</Link>
            <span>©{new Date().getFullYear()}</span>
        </div>
    </div>
};

