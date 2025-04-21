"use client";
import '@/app/ui/global.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userLoggedIn, setUserLoggedIn]= useState<boolean>(isUserLoggedIn());
    const pathname= usePathname();
    useEffect(()=> {
        setUserLoggedIn(isUserLoggedIn());
    }, [pathname]);
    return (
        <html lang="en">
            <body className='h-full min-h-[100vh] flex flex-col'>
                <div className="h-full flex flex-col gap-0 justify-between grow">
                    {
                        userLoggedIn ?
                        <UserHeader/> :
                        <NoUserHeader />
                    }
                    <div className="w-full max-w-[30rem] mx-auto">
                        {children}
                    </div>
                    <Footer />
                </div>
            </body>
        </html>
    );
}

const NoUserHeader = () => {
    return <header>
        <div className="w-full py-2">
            <div className="w-[97%] max-w-[63rem] flex justify-between mx-auto">
                <Link className="text-3 font-semibold" href={"/"}>Basic Logo</Link>
                <div className="flex gap-4">
                    <Link href={"/login"} className='hover:text-[#55f]'>Log in</Link>
                    <Link href={"/register"} className='hover:text-[#55f]'>Register</Link>
                </div>
            </div>
        </div>
    </header>;
};

const UserHeader = () => {
    return <header>
        <div className="w-full py-2">
            <div className="w-[97%] max-w-[63rem] flex justify-between mx-auto">
                <Link className="text-3 font-semibold" href={"/"}>Basic Logo</Link>
                <div className="flex gap-4">
                    {/* <Link href={"/register"} className='hover:text-[#55f]'>Register</Link> */}
                    <Link href={"/profile"} className='hover:text-[#55f]'>Profile</Link>
                    <Link href={"/logout"} className='hover:text-[#55f]'>Log out</Link>
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
            {/* TAY */}
        </div>
    </div>
};

/**
 * Checks if the user is connected by looking for the refreshToken in the local storage
 * @returns {boolean}
 */
export const isUserLoggedIn= () => {
    if (window.localStorage.getItem("refreshToken")) {
        return true;
    } else {
        return false;
    }
};
/**
 * Return the refreshToken in the local storage if it exists and null if it doesn't.
 * @returns {string|null}
 */
export const refresh= () => {
    if (isUserLoggedIn()) {
        return window.localStorage.getItem('refreshToken');
    } else {
        return null;
    }
}
/**
 * Return the accessToken in the local storage if it exists and null if it doesn't.
 * @returns {string|null}
 */
export const access= () => {
    if (isUserLoggedIn()) {
        return window.localStorage.getItem('accessToken');
    } else {
        return null;
    }
}