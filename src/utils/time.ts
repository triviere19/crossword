
export const formatTimer = (totalSeconds: number) => {
    const seconds = totalSeconds % 60;
    const minutes = (Math.floor(totalSeconds / 60)) % 60;
    const hours = (Math.floor(totalSeconds / 60 / 60)) % 24;
    const days = (Math.floor(totalSeconds / 60 / 60 / 24));
    let timeString = "";
    timeString += days ? `${days.toString().padStart(2,'0')}:` : ``;
    timeString += hours ? days ? `${hours.toString().padStart(2,'0')}:` : `${hours.toString()}:` : ``;
    timeString += minutes ? hours ? `${minutes.toString().padStart(2,'0')}` : `${minutes.toString()}` : ``;
    timeString += `:${seconds.toString().padStart(2,'0')}`;
    
    return timeString;
}

export const formatTimeString = (ms: number) => {
    const milliseconds = ms % 1000;
    const seconds = (Math.floor(ms / 1000)) % 60;
    const minutes = (Math.floor(ms / 1000 / 60)) % 60;
    const hours = (Math.floor(ms / 1000 / 60 / 60)) % 24;
    const days = (Math.floor(ms / 1000 / 60 / 60 / 24));
    let timeString = "";
    timeString += days ? `${days.toString()}d, ` : ``;
    timeString += hours ? days ? `${hours.toString().padStart(2,'0')}h, ` : `${hours.toString()}h, ` : ``;
    timeString += minutes ? hours ? `${minutes.toString().padStart(2,'0')}m, ` : `${minutes.toString()}m, ` : ``;
    timeString += seconds ? minutes ? `${seconds.toString().padStart(2,'0')}s, ` : `${seconds.toString()}s, ` : ``;
    timeString += `${milliseconds.toString().padStart(2,'0')}ms`;
    
    return timeString;
} 