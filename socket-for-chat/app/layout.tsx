"use client";
import '@/app/ui/global.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { isThereAnyToken } from './services/utils';
import { NotificationsContext, notificationType, useNotificationContext } from './contexts/contexts';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userLoggedIn, setUserLoggedIn]= useState<boolean>(false);
    const pathname= usePathname();

    const [notificationsList, setNotificationsList] = useState<notificationType[]>([]);
    const createNotification= (notif: notificationType)=> {
        setNotificationsList(list=> ([...list, notif]));
    };
    const deleteNotification= (id: string)=> {
        setNotificationsList(list=> list.filter(notif=> notif.id!== id));
    };

    useEffect(()=> {
        setUserLoggedIn(isThereAnyToken(window.localStorage));
    }, [pathname]);

    return (
        <html lang="en">
            <body className='h-full min-h-[100vh] flex flex-col'>
                <NotificationsContext.Provider value={{notifications: notificationsList, setNotifications: setNotificationsList, create: createNotification, delete: deleteNotification}}>
                    <div className="h-full flex flex-col gap-0 justify-between grow">
                        <div className="flex flex-col gap-0">
                            <HeaderBase hasUser={userLoggedIn} />
                            <div className="h-0 w-full relative justify-self-start">
                                <div className="absolute top-0 right-16 flex gap-4 flex-col items-end">
                                    {
                                        notificationsList.map((notif , index)=> <NotificationDisplayer notif={notif} key={index} />)
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-[30rem] mx-auto">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </NotificationsContext.Provider>
            </body>
        </html>
    );
};

const NotificationDisplayer= ({notif}: {notif: notificationType})=> {

    const selfRef= useRef<HTMLDivElement>(null);

    const notifCtx= useNotificationContext();

    useEffect(() => {
        const effect= setTimeout(()=> {
            if (selfRef.current) {
                selfRef.current.classList.add("animate-fade-out-left");
            }
            setTimeout(()=> {
                notifCtx.delete(notif.id);
            }, 300);
        }, 5000);

        return ()=> clearTimeout(effect);
    }, []);

    return <div className="flex flex-col gap-2 p-4 bg-white rounded-md shadow-xl w-max max-w-[22rem] animate-fade-in-left" ref={selfRef}>
        <div className={`flex flex-row items-center gap-2 text-lg font-semibold ${notif.type=== 'error'&& 'text-red-500'} ${notif.type=== 'warning'&& 'text-orange-500'} ${notif.type=== 'success'&& 'text-green-500'} ${notif.type=== 'error'&& 'text-red-500'} ${notif.type=== 'info'&& 'text-blue-500'}`}>
            {notif.type==="error" &&<XCircleIcon className="text-xl" width={20} />}
            {notif.type==="info" &&<InformationCircleIcon className="text-xl" width={20} />}
            {notif.type==="warning" &&<ExclamationTriangleIcon className="text-xl" width={20} />}
            {notif.type==="success" &&<CheckCircleIcon className="text-xl" width={20} />}
            {notif.title}
        </div>
        <div className="text-gray-400">{notif.message}</div>
    </div>;
};

const HeaderBase= ({hasUser}: {hasUser: boolean})=> {
    return <header>
        <div className="w-full py-2">
            <div className="w-[97%] max-w-[63rem] flex justify-between mx-auto">
                <Link className="text-3 font-semibold" href={"/"}>Basic Logo</Link>
                <div className="flex gap-4">
                    {hasUser ?
                        <>
                            <Link href={"/profile"} className='hover:text-[#55f]'>Profile</Link>
                            <Link href={"/chat"} className='hover:text-[#55f]'>Chat</Link>
                            {
                                localStorage.getItem('adminToken') &&
                                <Link href={"/admin"} className='hover:text-[#55f]'>Admin</Link>
                            }
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
            <span>© {new Date().getFullYear()}</span>
        </div>
    </div>
};

