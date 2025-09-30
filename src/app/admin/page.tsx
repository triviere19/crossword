import AdminLogin from "@/components/Login/AdminLogin";
import styles from "../page.module.css";

export default function Admin() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AdminLogin/>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
