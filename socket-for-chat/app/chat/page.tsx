"use client"
import { useEffect, useState } from "react";
import { getUsersList, userListItem } from "../lib/users";
import { socket } from "../socket/socket";

export default function Page() {
    const [users, setUsers]= useState<userListItem[]>([]);
    const [connected, setConnected]= useState<boolean>(false);

    useEffect(()=> {
        getUsersList().then(response=> {
            setUsers(response);
        }).catch (err=> {
            console.error(err);
        });

        const onConnect= ()=> setConnected(true);
        const onDisconnect= ()=> setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        
        return ()=> {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };

    }, []);
    
    return <>
        <div>
            <p>Status: {connected ? "Connected ✅" : "Disconnected ❌"}</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NameD</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map(user=>
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </>;
};