import styles from "./CheckButton.module.css";
import { CSSProperties, useState } from "react";

export interface CheckButtonProps {
    styles?: CSSProperties,
    className?: string,
    onClick?: () => void,
}

export default function CheckButton(props: CheckButtonProps){

    const [hovered, setHovered] = useState(false);

    /** simulate temporary touch to show animation on mobile devices */
    const handleTouch = () => {
        setHovered(true);
        setTimeout(() => setHovered(false), 600);
    }

    return (
        <button 
            className={`${styles.button} ${props.className}`} 
            onClick={props.onClick}
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}
            onTouchEnd={handleTouch}
        >
            <div className={`${styles.eyes} ${hovered ? styles.show_eyes : styles.hide_eyes}`}>👀</div>
            <p>CHECK</p>
        </button>
    );
}