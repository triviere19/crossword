import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./PuzzleLoading.module.css";
import { Mirage } from 'ldrs/react';
import 'ldrs/react/Mirage.css';

const dialogues = [
    "consulting the overlords...",
    "asking the professor...",
    "seeking truth...",
    "petting my cat...",
    "spending tokens...",
    "discovering new words...",
    "trying to remember what we were doing...",
    "giving open ai some money...",
    "getting fired up... this is gonna be a good one!",
    "nervously laughing at how bad this puzzle is coming out...",
    "inquiring my good friend, Mr. GPT...",
    "interrogating the dictionary...",
    "getting slightly distracted...",
    "demanding answers...",
];

export default function PuzzleLoading(){

    const [show, setShow] = useState(false);
    const [dialogue, setDialogue] = useState("");
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        const pickNew = () => {
            setDialogue(dialogues[Math.floor(Math.random()*dialogues.length)]);
            setTimeout(() => setShowText(false), 4000);
            setTimeout(() => setShowText(true), 5000);
            setTimeout(pickNew, 5000);
        }
        setShow(true);
        pickNew();
    }, []);

    return (
        <div className={styles.container} style={{opacity: show ? 1 : 0}}>
            {<Typography style={{opacity: showText ? 1 : 0, transition: 'opacity 1000ms ease-in-out'}}>{dialogue}</Typography>}
            <Mirage
                size="60"
                speed="2.5"
                color="white" 
            />
        </div>
    );
}