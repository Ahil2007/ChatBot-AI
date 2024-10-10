const fs = require('fs');
const path = require('path');

const removePunctuation = (str) => {
    return str
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, "")
        .replace(/\s+/g, ' ')
        .trim()
        .normalize("NFC");
};

// Load chatbot data
const chatbotDataPath = path.resolve('./chatbot_data.json');
let chatbotData = {};

try {
    const rawData = fs.readFileSync(chatbotDataPath, 'utf8');
    chatbotData = JSON.parse(rawData);
} catch (error) {
    console.error('Error loading chatbot data:', error);
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        const userMessage = req.body.userMessage.trim();
        const normalizedMessage = removePunctuation(userMessage.toLowerCase());

        const knownAnswer = chatbotData[normalizedMessage] || "I'm sorry, I'm learning now...";
        res.status(200).json({ reply: knownAnswer });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
