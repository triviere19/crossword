
export const formatTimer = (totalSeconds: number) => {
    const seconds = totalSeconds % 60;
    const minutes = (Math.floor(totalSeconds / 60)) % 60;
    const hours = (Math.floor(totalSeconds / 60 / 60)) % 24;
    const days = (Math.floor(hours / 60 / 60 / 24));
    let timeString = "";
    timeString += days ? `${days.toString().padStart(2,'0')}:` : ``;
    timeString += hours ? days ? `${hours.toString().padStart(2,'0')}:` : `${hours.toString()}:` : ``;
    timeString += minutes ? hours ? `${minutes.toString().padStart(2,'0')}` : `${minutes.toString()}` : ``;
    timeString += `:${seconds.toString().padStart(2,'0')}`;
    
    return timeString;
}