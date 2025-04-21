"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BASE_API_URL } from "../register/page";
import { useRouter } from "next/navigation";
import { isThereAnyToken } from "../services/utils";

export default function Page() {

    const [inputState, setInputState]= useState<Record<string, any>>({username: "", pass: ""});
    const [error, setError]= useState({hasErrors: false, message: ""});

    const history= useRouter();

    const handleInputsChange= (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputState({...inputState, [event.currentTarget.name] : event.currentTarget.value});
        setError({hasErrors: false, message: ""});
    };

    const formSubmit= (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputState.username.trim()=== "") {
            setError({
                hasErrors: true,
                message: "Please enter a correct user name"
            });
            return;
        }
        if (inputState.pass=== "") {
            setError({
                hasErrors: true,
                message: "Password field should not be empty"
            });
            return;
        }
        console.log(inputState);

        const responseBody= {
            username: inputState.username,
            password: inputState.pass
        };
        try {
            fetch( BASE_API_URL + '/login', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(responseBody)
            }).then(response=> {
                console.log(response);
                return response.json();
            }).then(data=> {
                console.log(data);
                if (data.error) {
                    setError({
                        hasErrors: true,
                        message: "Invalid creadentials"
                    });
                    return;
                }
                if (data.success) {
                    console.log("Login successful");
                    localStorage.setItem("accessToken", data.data.accessToken);
                    localStorage.setItem("refreshToken", data.data.refreshToken);
                    history.push('/profile');
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(()=> {
        if (isThereAnyToken(localStorage)) {
            history.push('/');
        }
    }, []);

    return <>
        <div className="flex flex-col gap-8">
            <h1 className="text-xl text-center">Log in into your account</h1>
            <form onSubmit={formSubmit} className="flex flex-col gap-2 my-2">
                <input type="text" name="username" id="username" onChange={handleInputsChange} value={inputState.username} placeholder="User name" />
                <input type="password" name="pass" id="pass" onChange={handleInputsChange} value={inputState.pass} placeholder="User password" />
                {error.hasErrors && <p className="text-[#f00]">{error.message}</p>}
                <input type="submit" className="px-4 py-1 bg-[#333] text-white hover:bg-[#55f] cursor-pointer" value={"Log in"} />
            </form>
        </div>
    </>;
}