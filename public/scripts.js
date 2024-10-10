// Automatically scroll to the bottom when new content is added
function scrollToBottom() {
    const chatboxContent = document.getElementById('chatbox-content');
    chatboxContent.scrollTop = chatboxContent.scrollHeight;
}

// Simulate typing animation by displaying the response one character at a time
function typeResponse(message, element, sender, speed = 50) {
    element.innerHTML = `<span class="bold-label">${sender}:</span> `;  // Bold sender label (User or ChatBot AI)

    let i = 0;
    function typeWriter() {
        if (i < message.length) {
            element.innerHTML += message.charAt(i);  // Append one character at a time
            i++;
            setTimeout(typeWriter, speed);  // Delay before typing the next character
        }
    }
    typeWriter();
}

// Display a message in the chatbox
function displayMessage(sender, message, isTyping = false) {
    const chatboxContent = document.getElementById('chatbox-content');

    const messageElement = document.createElement('p');
    messageElement.classList.add(sender === 'AI' ? 'ai-message' : 'user-message');

    if (isTyping) {
        messageElement.innerHTML = `<span class="bold-label">ChatBot AI:</span> Typing...`;
        chatboxContent.appendChild(messageElement);
        scrollToBottom();
        return messageElement;
    }

    // Display the message with bold sender label
    messageElement.innerHTML = `<span class="bold-label">${sender}:</span> ${message}`;
    chatboxContent.appendChild(messageElement);
    scrollToBottom();
    return messageElement;
}

// Simulate the chatbot response with typing effect
async function fetchResponse(message) {
    // Display the user message immediately with the "User:" label
    displayMessage('User', message);  

    // Show typing indicator before AI response
    const typingElement = displayMessage('AI', '', true);  // Display 'Typing...' message

    try {
        // Fetch AI response from server
        const response = await fetch('/ask-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage: message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        typingElement.remove(); // Remove typing indicator

        // Check if the reply exists
        if (data.reply) {
            const aiMessageElement = displayMessage('AI', '', false);
            typeResponse(data.reply, aiMessageElement, 'ChatBot AI', 50);
        } else {
            typingElement.remove(); // Remove typing indicator
            displayMessage('AI', "I'm sorry, I'm learning now...", false);
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        typingElement.remove(); // Remove typing indicator
        displayMessage('AI', "I'm sorry, I'm learning now...", false);
    }
}


// Trigger sending the message and getting a response
function sendMessage() {
    const userInput = document.getElementById('user-input').value; // Ensure the ID matches your HTML
    if (userInput.trim() === '') return;

    fetchResponse(userInput);  // Send user input to backend for AI response
    document.getElementById('user-input').value = '';  // Clear input field
}

// Trigger sendMessage() when the Enter key is pressed
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Handle send button click
const sendButton = document.querySelector('.chat-input button'); // Get the send button correctly
sendButton.addEventListener('click', function() {
    sendMessage();
});
