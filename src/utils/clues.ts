

export const generateClue = async (word: string, difficulty: string) => {

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: 'o4-mini',
                messages: [
                    {
                        role: 'user',
                        content: `Write a crossword puzzle clue for the word ${word}. Make it appropriatly difficult such that a ${difficulty} could solve. No formatting, just simply provide the clue.`
                    }
                ],
                // temperature: 0.7, // unsupported in mini
                max_completion_tokens: 2000
            }),
        });
    
        const data = await response.json();
    
        return data.choices[0].message.content;

    } catch (e) {
        console.error(e);
        return undefined;
    }
 
}