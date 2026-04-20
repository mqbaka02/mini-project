"use client"
import { useEffect, useState } from "react";
import { getUsersList, userListItem } from "../lib/users";
import { socket } from "../socket/socket";
import { useNotificationContext } from "../contexts/contexts";
type user= {id: number, name: string};
export default function Page() {
    const [users, setUsers]= useState<userListItem[]>([]);
    const [connected, setConnected]= useState<boolean>(false);
    const [connectedUsers, setConnectedUsers] = useState<user[]>([]);

    useEffect(()=> {
        getUsersList().then(response=> {
            setUsers(response);
        }).catch (err=> {
            console.error(err);
        });

        const onConnect= ()=> setConnected(true);
        const onDisconnect= ()=> setConnected(false);
        const onConnectedUsers= (p: {connectedUsers: user[]})=> {
            console.log(p);
            setConnectedUsers(p.connectedUsers as user[]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("server_message", onConnectedUsers);
        
        return ()=> {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("server_message", onConnectedUsers);
        };

    }, []);

    const notifCtx= useNotificationContext();
    
    useEffect(() => {
        if (connected) {
            notifCtx.create({
                title: "Connected",
                message: "You have been succesfully connected to server socket",
                type: "success",
                id: String(new Date().getUTCMilliseconds()),
            });
        } else {
            notifCtx.create({
                title: "Disconnected",
                message: "You have been disconnected from server socket",
                type: "error",
                id: String(new Date().getUTCMilliseconds()),
            });
        }
    }, [connected]);
    
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
                        <tr key={user.id} className={connectedUsers.some(el=> el.id=== user.id)? "text-green-500": ""}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </>;
};