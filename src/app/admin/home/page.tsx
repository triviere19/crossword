
import { getServerSession } from "next-auth";
import styles from "../../page.module.css";
import Logout from "@/components/Loguout/Logout";
import Link from "next/link";
import { authOptions } from "@/utils/auth";
import { Button, Typography } from "@mui/material";
import Image from "next/image";

export default async function Admin() {
    
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.center_group}>
                    <Image
                        src="/icons/logo.svg"
                        width={100}
                        height={100}
                        alt="crossword.tyriviere"
                    />
                    <Typography variant="h4" textAlign={"center"}>hello, {session?.user.name}</Typography>
                    <div className={styles.button_group}>
                        <Button variant="contained"><Link href={"/admin/generator"}>Generator</Link></Button>
                        <Logout/>
                    </div>
                </div>
            </main>
        </div>
    );
}
