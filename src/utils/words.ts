
/** Get word list by string */
export const getWordList = async (list: string) => {
    switch(list){
        case "MIT":
        case "mit":
        default:
            return await getMitWordList();
    }
}

/** Get word list from MIT */
export const getMitWordList = async () => {
    const url = "https://www.mit.edu/~ecprice/wordlist.10000";

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch wordlist: ${res.status} ${res.statusText}`);
    const text = await res.text();
    // split on any newline, trim, remove empties, dedupe if you want
    const words = text
        .split(/\r?\n/)
        .map(w => w.trim())
        .filter(Boolean);
    return words;
}