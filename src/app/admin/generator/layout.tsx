import { CrosswordProvider } from "@/components/Crossword/common/CrosswordContext/CrosswordContext";
import { ReactNode } from "react";

export default function Layout({children}:{children: ReactNode}){
    return (
        <CrosswordProvider>
            {children}
        </CrosswordProvider>
    );
}