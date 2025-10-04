"use client"

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";


export default function Logout(){

    return (
        <Button onClick={()=>signOut()} variant="outlined">Logout</Button>
    );
}