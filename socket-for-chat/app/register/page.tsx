"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { isUserLoggedIn } from "../layout";

export const BASE_API_URL= process.env.NEXT_PUBLIC_BASE_API_URL;

export default function Page() {

    const [inputState, setInputState]= useState<Record<string, any>>({username: "", pass: "", repass: ""});
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
        if (inputState.pass=== "" || (inputState.pass !== inputState.repass)) {
            if (inputState.pass=== "") {
                setError({
                    hasErrors: true,
                    message: "Password field should not be empty"
                });
            } else {
                setError({
                    hasErrors: true,
                    message: "Passwords do not match"
                });
            }
            return;
        }
        console.log(inputState);

        const responseBody= {
            username: inputState.username,
            password: inputState.pass
        };
        try {
            fetch( BASE_API_URL + '/user/create', {
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
                        message: "The user name you chose is already taken. Use another name."
                    });
                    return;
                }
                if (data.status=== "success") {
                    console.log("UserCreation successful");
                    history.push('/success');
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(()=> {
        if (isUserLoggedIn()) {
            history.push('/');
        }
    }, []);

    return <>
        <div className="flex flex-col gap-8">
            <h1 className="text-xl text-center">Create your account</h1>
            <form onSubmit={formSubmit} className="flex flex-col gap-2 my-2">
                <input type="text" name="username" id="username" onChange={handleInputsChange} value={inputState.username} placeholder="Your user name" />
                <input type="password" name="pass" id="pass" onChange={handleInputsChange} value={inputState.pass} placeholder="Your password" />
                <input type="password" name="repass" id="repass" onChange={handleInputsChange} value={inputState.repass} placeholder="Confirm your password" />
                {error.hasErrors && <p className="text-[#f00]">{error.message}</p>}
                <input type="submit" className="px-4 py-1 bg-[#333] text-white hover:bg-[#55f] cursor-pointer" value={"Create an account"} />
            </form>
        </div>
    </>;
}