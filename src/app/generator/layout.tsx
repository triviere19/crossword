import { CrosswordProvider } from "@/context/CrosswordContext";
import { ReactNode } from "react";

export default function Layout({children}:{children: ReactNode}){
    return (
        <CrosswordProvider>
            {children}
        </CrosswordProvider>
    );
}