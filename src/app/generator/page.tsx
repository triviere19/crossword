import styles from "./page.module.css";
import CrosswordPuzzle from "@/components/v2/CrosswordPuzzle/CrosswordPuzzle";

export default function Generator() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CrosswordPuzzle/>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
