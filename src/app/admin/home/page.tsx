
import { getServerSession } from "next-auth";
import styles from "../../page.module.css";
import Logout from "@/components/Loguout/Logout";
import Link from "next/link";
import { authOptions } from "@/utils/auth";

export default async function Admin() {
    
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <p>hello, {session?.user.name}</p>
                <button><Link href={"/admin/generator"}>Generator</Link></button>
                <Logout/>
            </main>
            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}
