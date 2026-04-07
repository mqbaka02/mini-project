"use client"
import { io } from "socket.io-client";
import { BASE_API_URL } from "../register/page";

const accessToken= localStorage.getItem("accessToken");
const data= JSON.parse(localStorage.getItem("data")??"");
const id= data?.id;

export const socket = io(BASE_API_URL, {
    // If using self-signed certs in dev, you might need:
    rejectUnauthorized: false, 
    transports: ["websocket"], // Optional: forces websocket instead of polling
    auth: {
        accessToken: accessToken,
        id: id,
    }
});