const fs = require('fs');
const path = require('path');

// Function to remove punctuation and normalize strings
const removePunctuation = (str) => {
    return str
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, "")  // Strip punctuation
        .replace(/\s+/g, ' ')                             // Replace multiple spaces with a single space
        .trim()
        .normalize("NFC");
};

// Load chatbot data (known questions and answers from JSON) and normalize keys
let chatbotData;
const dataPath = path.resolve('./chatbot_data.json');  // Path to the JSON file

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    
    // Normalize all keys: lowercase and remove punctuation
    chatbotData = {};
    const rawDataParsed = JSON.parse(rawData);
    for (const key in rawDataParsed) {
        const normalizedKey = removePunctuation(key.toLowerCase().trim());
        chatbotData[normalizedKey] = rawDataParsed[key];
    }
    console.log('Chatbot data loaded and normalized successfully.');
} catch (error) {
    console.error('Error loading chatbot data:', error);
}

// Vercel's handler function for serverless
export default function handler(req, res) {
    if (req.method === 'POST') {
        const userMessage = req.body.userMessage.trim();  // Handle Bangla input as well
        const normalizedMessage = removePunctuation(userMessage.toLowerCase()); // Normalize input

        const knownAnswer = chatbotData[normalizedMessage]; // Check if a response is found

        if (knownAnswer) {
            res.status(200).json({ reply: knownAnswer }); // Known question, respond in Bangla
        } else {
            fs.appendFileSync('unanswered_questions.txt', userMessage + '\n', (err) => {
                if (err) console.error('Error saving question:', err);
            });
            res.status(200).json({ reply: "I'm sorry, I'm still learning now..." }); // Default message in Bangla
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
