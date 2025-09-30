
import { getServerSession } from "next-auth";
import styles from "../../page.module.css";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Logout from "@/components/Loguout/Logout";

export default async function Admin() {
    
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <p>hello, {session?.user.name}</p>
                <Logout/>
            </main>
            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}
