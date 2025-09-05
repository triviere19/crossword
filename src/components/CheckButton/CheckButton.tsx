import styles from "./CheckButton.module.css";
import { CSSProperties, useState } from "react";

export interface CheckButtonProps {
    styles?: CSSProperties,
    className?: string,
    onClick?: () => void,
}

export default function CheckButton(props: CheckButtonProps){

    const [hovered, setHovered] = useState(false);

    return (
        <button 
            className={`${styles.button} ${props.className}`} 
            onClick={props.onClick}
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}
        >
            <div className={`${styles.eyes} ${hovered ? styles.show_eyes : styles.hide_eyes}`}>👀</div>
            <p>CHECK</p>
        </button>
    );
}