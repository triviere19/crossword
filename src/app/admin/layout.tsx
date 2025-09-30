"use client"

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react"


export interface AdminLayoutProps {
    children: ReactNode,
}

export default function AdminLayout({children, ...props}: AdminLayoutProps){

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}