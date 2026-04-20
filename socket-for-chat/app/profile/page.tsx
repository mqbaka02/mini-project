"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkToken, isThereAnyToken } from "../services/utils";
import { BASE_API_URL } from "../register/page";
import { clearLocaltDatas } from "../logout/page";
import { getProfileInfo, updateProfileInfo } from "../lib/profile";
import { useNotificationContext } from "../contexts/contexts";

export default function Page() {
    const history= useRouter();
    const [profileData, setProfileData]= useState<any>({});
    const [profileFormData, setProfileFormData]= useState<any>({});

    const [isEditing, setIsEditing]= useState<boolean>(false);

    const [profileLoading, setProfileLoading]= useState(true);

    const notifCtx= useNotificationContext();

    useEffect(()=> {
        if (!isThereAnyToken(localStorage)) {
            history.push('/login');
        } else {
            checkToken(localStorage.getItem('refreshToken')).then(answer => {
                if (!answer) {
                    clearLocaltDatas();
                    history.push('/');
                }
            });
        }

        const id= JSON.parse(localStorage.getItem('data') || "{}")?.id;

        getProfileInfo(id).then(res=> {
            setProfileData(res);
            setProfileLoading(false);
        }).catch((err: Error)=> {
            console.log(err);
            notifCtx.create({
                type: "error",
                title: "Can't fetch profile info",
                message: err.message,
                id: String(new Date().getMilliseconds()),
            });
            setProfileLoading(false);
        });

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
        updateProfileInfo(reqBody).then(res=>{
            if (res.success) {
                console.log("Operation successful");
                notifCtx.create({
                    type: "success",
                    title: "Success",
                    message: "Profile info has been updated succesfully!",
                    id: String(new Date().getMilliseconds()),
                });
                setIsEditing(false);
            }
            if (res.error) {
                notifCtx.create({
                    type: "error",
                    title: "Can't update profile info",
                    message: "An error has occured",
                    id: String(new Date().getMilliseconds()),
                });
                console.log(res.error);
            }
        });
    };

    return<>
    <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-xl text-center">Your profile</h1>
        {
            profileLoading ?
            <>Loading you profile info...</>
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