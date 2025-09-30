import styles from "./page.module.css";
import CrosswordPuzzle from "@/components/CrosswordPuzzle/CrosswordPuzzle";

export default function Home() {
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
