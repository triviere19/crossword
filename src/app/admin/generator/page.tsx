
import { getServerSession } from "next-auth";
import styles from "../../page.module.css";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CrosswordGenerator from "@/components/CrosswordGenerator/CrosswordGenerator";

export default async function Generator() {
    
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <CrosswordGenerator/>
            </main>
            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}
