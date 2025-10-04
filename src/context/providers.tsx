"use client"

import { MuiThemeProvider } from "@/theme/theme";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react"

export default function Providers({children}: {children: ReactNode}){

    return (
        <SessionProvider>
            <MuiThemeProvider>
                {children}
            </MuiThemeProvider>
        </SessionProvider>
    );
}