
import { getServerSession } from "next-auth";
import styles from "../../page.module.css";
import Logout from "@/components/Loguout/Logout";
import Link from "next/link";
import { authOptions } from "@/utils/auth";
import { Button, ButtonGroup, Typography } from "@mui/material";

export default async function Admin() {
    
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Typography variant="h4" textAlign={"center"}>hello, {session?.user.name}</Typography>
                <div className={styles.button_group}>
                    <Button variant="contained"><Link href={"/admin/generator"}>Generator</Link></Button>
                    <Logout/>
                </div>
            </main>
            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}
