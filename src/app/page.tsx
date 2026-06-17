import { Button, Typography } from "@mui/material";
import styles from "./page.module.css";
import Link from "next/link";
import { PlayArrow } from "@mui/icons-material";
import Logo from "@/components/Logo/Logo";
import Image from "next/image";

export default function Home() {
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
          <Typography variant="h4">Mini Crossword</Typography>
          <Typography fontStyle={"italic"}>"Boycotting NY Times since 2026!"</Typography>
          {/* <Logo height={30}/> */}
          <Button 
            component={Link} 
            href="/daily-puzzle"
            variant="outlined"
          ><PlayArrow/>&nbsp;Play</Button>
        </div>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
