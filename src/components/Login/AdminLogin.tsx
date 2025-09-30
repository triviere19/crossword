"use client"

import { useEffect, useState } from "react";
import Login from "./Login";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export interface AdminLoginProps {

}

export default function AdminLogin(props: AdminLoginProps){

    const { status } = useSession();
    const router = useRouter();
    const [failed, setFailed] = useState(false);

    const onLogin = (username: string, password: string) => {
        setFailed(false);
        signIn('credentials', { 
            username, password,
            redirect: false,
        }).then((res) => {
            if(res?.ok){
                // router.push("/admin/home");
            } else {
                throw('Nope');
            }
        }).catch(() => {
            setFailed(true);
        })
    }

    useEffect(() => {
        if(status === "authenticated") router.push("/admin/home");
    }, [status]);

    return (
        <Login
            onLogin={onLogin}
            title={'Admin Portal'}
            failed={failed}
        />
    );
}