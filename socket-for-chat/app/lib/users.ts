import { BASE_API_URL } from "../register/page";
import { _fetch } from "./fetch";

export type userDetails= {
    name: string,
    id: number,
    role: string,
};
export const getUsers: ()=> Promise<userDetails[]> = async () => {
    const res = await _fetch(BASE_API_URL + "/users", {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include",
    })
    if (!res.ok) {
        throw new Error("Failed to fetch, " + res.status);
    }

    const data = await res.json();
    if (data.data) return (data.data);
    return data;
};

export type userListItem= Omit<userDetails, "role">;

export const getUsersList: ()=> Promise<userListItem[]>= async ()=> {
    const res = await _fetch(BASE_API_URL + "/users/list", {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include",
    })
    if (!res.ok) {
        throw new Error("Failed to fetch, " + res.status);
    }

    const data = await res.json();
    if (data.data) return (data.data);
    return data;
};
export const getUser: (id: number) => Promise<userDetails> = async (id: number) => {
    const res = await _fetch(BASE_API_URL + "/user/" + id, {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Error while trying to Fetch users. " + res.status);
    }
    const data = await res.json();
    if (data.data) return (data.data.user);
    return data;
};