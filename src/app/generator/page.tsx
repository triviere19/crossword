"use client"

import { useCrossword } from "@/context/CrosswordContext";
import styles from "./page.module.css";
import CrosswordDesktop from "@/components/Crossword/v3/CrosswordDesktop/CrosswordDesktop";
import { useEffect } from "react";
import { GetCrosswordResult } from "../api/crossword/v2/route";
import { useMediaQuery, useTheme } from "@mui/material";
import CrosswordMobile from "@/components/Crossword/v3/CrosswordMobile/CrosswordMobile";

export default function Generator() {

  const { setLayout } = useCrossword();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
      fetch("/api/crossword/v2").then(async (res) => {
          const result: GetCrosswordResult = await res.json();
          if(res.ok){
              if(result.layout){
                  setLayout(result.layout);
              } else {
                  console.error(`Error: could not set state. Crossword layout no good.`);
              }
          } else {
              console.error(res.status, result.error);
          }
      });
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        { isMobile ? <CrosswordMobile/> : <CrosswordDesktop/> }
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
