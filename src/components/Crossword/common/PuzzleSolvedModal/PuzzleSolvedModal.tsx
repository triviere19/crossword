import styles from "./PuzzleSolvedModal.module.css";
import { formatTimer } from "@/utils/time";
import TimerIcon from '@mui/icons-material/Timer';
import { ReactNode } from "react";


export interface PuzzleSolvedModalProps {
    solved: boolean,
    time: number,
    children?: ReactNode,
}

export default function PuzzleSolvedModal({children, ...props}: PuzzleSolvedModalProps){

    const getAward = (seconds: number) => {
        if(seconds == 0) return "";
        else if(seconds < 10) return "🖕";
        else if(seconds < 20) return "🥸";
        else if(seconds < 30) return "🤯";
        else if(seconds < 45) return "😳";
        else if(seconds < 120) return "😎";
        else if(seconds < 300) return "🫡";
        else if(seconds < 600) return "😬";
        else return "🤦‍♂️";
    }

    const getKudos = (seconds: number) => {
        if(seconds == 0) return "";
        else if(seconds < 10) return "Okay try hard...";
        else if(seconds < 20) return "Impossible.";
        else if(seconds < 30) return "Holy Moly!";
        else if(seconds < 60) return "Fire!";
        else if(seconds < 120) return "Nice!";
        else if(seconds < 300) return "Solved!";
        else if(seconds < 600) return "Finally.";
        else return "About Time...";
    }

    return (
        <div 
            className={styles.overlay}
            style={{
                opacity: props.solved ? 1 : 0,
                pointerEvents: props.solved ? 'all' : 'none',
            }}
        >
            <div className={styles.modal}>
                <h2>{getKudos(props.time)}</h2>
                <h1 className={styles.award}>{getAward(props.time)}</h1>
                <div className={styles.time_box}>
                    <TimerIcon/>
                    <h3>{formatTimer(props.time)}</h3>
                </div>
                {children}
            </div>
        </div>
    );
}