import DailyCrosswordPuzzle from "@/components/Crossword/v3/DailyCrosswordPuzzle/DailyCrosswordPuzzle";
import styles from "../page.module.css";

export default function DailyPuzzle() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <DailyCrosswordPuzzle/>
            </main>
            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}
