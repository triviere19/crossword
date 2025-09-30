"use client"

import { useState } from "react";
import Login from "./Login";


export interface AdminLoginProps {

}

export default function AdminLogin(props: AdminLoginProps){

    const [failed, setFailed] = useState(false);

    const onLogin = () => {
        setFailed(!failed);
    }

    return (
        <Login
            onLogin={onLogin}
            title={'Admin Portal'}
            failed={failed}
        />
    );
}