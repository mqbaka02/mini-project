import { BASE_API_URL } from "../register/page";
import { _fetch } from "./fetch";

export type profileData = {
    userID: number,
    profileID: string,
    firstname: string,
    name: string,
    age: number,
};

export const getProfileInfo: (id: number)=> Promise<profileData>= async (id: number) => {
    const res= await _fetch(BASE_API_URL + '/profile-info', {
        method: 'POST',
        // headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') + ' ' + localStorage.getItem('refreshToken') },
        body: JSON.stringify({
            id: id
        }),
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error("Failed to fetch, " + res.status);
    }
    const data= await res.json();
    // console.log(data);
    if (data.data) {
        return data.data;
    }
};

export type updateInfoReqBody= {
    id: number,
    name: string,
    firstname: string,
    age: number,
};

export const updateProfileInfo: (reqBody: updateInfoReqBody)=> Promise<{success: boolean, error: unknown}>= async (reqBody: updateInfoReqBody)=> {
    const res= await _fetch(BASE_API_URL + '/update-info', {
        method: 'POST',
        headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') + ' ' + localStorage.getItem('refreshToken') },
        body: JSON.stringify(reqBody),
        credentials: "include"
    });
    if (!res.ok) {
        throw new Error("Failed to fetch, " + res.status);
    }
    const data= await res.json();
    return data;
};

// .catch(error => {
//     console.log("Can't fetch shit. Aborting.");
//     console.log(error);
//     history.push('/');
// });