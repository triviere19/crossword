
import { getServerSession } from "next-auth";
import styles from "../../page.module.css";
import CrosswordGenerator from "@/components/CrosswordGenerator/CrosswordGenerator";
import { authOptions } from "@/utils/auth";

export default async function Generator() {
    
    const session = await getServerSession(authOptions);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <CrosswordGenerator/>
            </main>
        </div>
    );
}
