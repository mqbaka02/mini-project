import { Context, createContext, ReactElement, SetStateAction, useContext } from "react";

export type notificationType= {
    title: string|ReactElement;
    message: string|ReactElement;
    type: "error"| "warning" | "info"| "success";
    id: string;
};

export type notificationsContextType= {
    notifications: notificationType[];
    setNotifications: React.Dispatch<SetStateAction<notificationType[]>>;
    create: (notif: notificationType)=> void;
    delete: (id: string)=> void;
};

export function useReturnCTX<T> (ContextHolder: Context<T>) {
    const ctx= useContext<T>(ContextHolder);
    if (!ctx) {
        throw new Error("No context to consume!");
    }
    return ctx;
};

export const NotificationsContext= createContext<notificationsContextType|null>(null);

export const useNotificationContext= ()=> useReturnCTX(NotificationsContext);