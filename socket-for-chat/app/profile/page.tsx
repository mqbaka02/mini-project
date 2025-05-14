"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkToken, isThereAnyToken } from "../services/utils";
import { BASE_API_URL } from "../register/page";
import { clearLocatDatas } from "../logout/page";

export default function Page() {
    const history= useRouter();
    const [profileData, setProfileData]= useState<any>({});
    const [profileFormData, setProfileFormData]= useState<any>({});

    const [isEditing, setIsEditing]= useState<boolean>(false);

    const [profileLoading, setProfileLoading]= useState(true);

    useEffect(()=> {
        if (!isThereAnyToken(localStorage)) {
            history.push('/login');
        } else {
            checkToken(localStorage.getItem('refreshToken')).then(answer => {
                if (!answer) {
                    clearLocatDatas();
                    history.push('/');
                }
            });
        }

        const id= JSON.parse(localStorage.getItem('data') || "{}")?.id;

        /**
         * This will fetch the profile info from the backend using the two tokens.
         * If the accessToken is expired, it requests for a new one using the refreshToken
         * and redo the fetching again.
         */
        const getProfileInfo = () => {
            fetch(BASE_API_URL + '/profile-info', {
                method: 'POST',
                headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') + ' ' + localStorage.getItem('refreshToken') },
                body: JSON.stringify({
                    id: id
                })
            }).then(response => response.json()).then(
                data => {
                    console.log(data);
                    if (data.data) {
                        setProfileData(data.data);
                        setProfileLoading(false);
                    } else if (data.error === "accessToken") {
                        fetch(BASE_API_URL + '/refresh', {
                            method: 'POST',
                            headers: { 'Content-type': 'application/json' },
                            body: JSON.stringify({
                                refreshToken: localStorage.getItem('refreshToken')
                            })
                        }).then(response => response.json()).then(data => {
                            console.log(data);
                            if (data.success) {
                                localStorage.setItem('refreshToken', data.refreshToken);
                                localStorage.setItem('accessToken', data.accessToken);
                                getProfileInfo();
                            }
                        });
                    } else {
                        console.log("RefreshToken is not valid");
                        history.push('/');
                    }
                }
            ).catch(error => {
                console.log("Can't fetch shit. Aborting.");
                console.log(error);
                history.push('/');
            });
        }
        getProfileInfo();
    }, [isEditing]);

    useEffect(()=> {
        setProfileFormData(profileData);
    }, [profileData]);

    const handleInputs= (event: any) => {
        event.preventDefault();
        setProfileFormData({...profileFormData, [event.currentTarget.name]: event.currentTarget.value=== "" ? null : event.currentTarget.value });
    };

    const submitForm= (event: any) => {
        event.preventDefault();
        console.log(profileFormData);
        const reqBody= {
            id: profileFormData.userID,
            name: profileFormData.name,
            firstname: profileFormData.firstname,
            age: profileFormData.age
        };
        const sendInfo= () => {
            fetch(BASE_API_URL + '/update-info', {
                method: 'POST',
                headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') + ' ' + localStorage.getItem('refreshToken') },
                body: JSON.stringify(reqBody)
            }).then(response => response.json()).then(
                data => {
                    console.log(data);
                    if (data.success) {
                        console.log("Operation successful");
                        setIsEditing(false);
                    } else if (data.error === "accessToken") {
                        fetch(BASE_API_URL + '/refresh', {
                            method: 'POST',
                            headers: { 'Content-type': 'application/json' },
                            body: JSON.stringify({
                                refreshToken: localStorage.getItem('refreshToken')
                            })
                        }).then(response => response.json()).then(data => {
                            console.log(data);
                            if (data.success) {
                                localStorage.setItem('refreshToken', data.refreshToken);
                                localStorage.setItem('accessToken', data.accessToken);
                                sendInfo();
                            }
                        });
                    }
                }
            );
        };
        sendInfo();
    };

    return<>
    <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-xl text-center">Your profile</h1>
        {
            profileLoading ?
            <>Loaging you profile info...</>
            :
            !isEditing ?
            <>
                <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                    <div className="font-semibold">ID</div>
                    <div className="text-right">{profileData.userID}</div>

                    <div className="font-semibold">Profile ID</div>
                    <div className="text-right">{profileData.profileID}</div>

                    <div className="font-semibold">First name</div>
                    <div className="text-right">{profileData.firstname || "--"}</div>

                    <div className="font-semibold">Name</div>
                    <div className="text-right">{profileData.name || "--"}</div>

                    <div className="font-semibold">Age</div>
                    <div className="text-right">{profileData.age || "--"}</div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-1 bg-[#333] text-white hover:bg-[#55f] cursor-pointer" onClick={()=>setIsEditing(true)}>Edit</button>
                </div>
            </>
            :
            <>
                <form onSubmit={submitForm}>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                        <div className="font-semibold">First name</div>
                        <input type="text" className="" value={profileFormData.firstname || ""} onChange={handleInputs} name="firstname" id="firstname" />

                        <div className="font-semibold">Name</div>
                        <input type="text" className="" value={profileFormData.name || ""} onChange={handleInputs} name="name" id="name" />

                        <div className="font-semibold">Age</div>
                        <input type="text" className="" value={profileFormData.age || ""} onChange={handleInputs} name="age" id="age" />
                    </div>
                    <div className="flex gap-2">
                        <input type="submit" className="px-4 py-1 bg-[#333] text-white hover:bg-[#55f] cursor-pointer" value={"Save"} />
                        <button className="px-4 py-1 bg-[#333] text-white hover:bg-[#f55] cursor-pointer" onClick={(e) => { e.preventDefault(); setIsEditing(false) }}>Cancel</button>
                    </div>
                </form>
            </>
        }
    </div>
    </>
};