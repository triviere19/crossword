"use client"

import styles from "./AboutButton.module.css";
import React from "react";
import Modal from "../common/Modal/Modal";
import { Button, Typography } from "@mui/material";
import { Close, Info } from "@mui/icons-material";
import Link from "next/link";



export default function AboutButton(): React.JSX.Element {

    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button onClick={()=>setOpen(true)} variant="outlined"><Info/>&nbsp;About</Button>
            <Modal open={open}>
                <div className={styles.top}>
                    <Info/>
                    <Typography variant="h5">About</Typography>
                </div>
                <Typography>
                    {`Everyday when someone presses play, a new puzzle is created. A random puzzle layout is generated using `}
                    <Link className={styles.link} href="https://github.com/triviere19/crossword-composer" target="_blank" rel="noopener noreferrer">crossword-composer</Link>
                    {`, with hints prompted by OpenAI API. So if your puzzle takes a minute to load, its because Mr. GPT is 
                        chugging along in the background!`}<br/><br/>{`Hope you enjoy your puzzle!`}
                </Typography>
                <div className={styles.bottom}>
                    <Button onClick={()=>setOpen(false)} variant="outlined">Swag</Button>
                </div>
            </Modal>
        </>
    );
}