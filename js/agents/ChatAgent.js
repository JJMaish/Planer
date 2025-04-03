class ChatAgent {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        
        if (chatForm) {
            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message) {
                    await this.handleUserMessage(message);
                    chatInput.value = '';
                }
            });
        }
    }

    async handleUserMessage(message) {
        try {
            // Display user message
            this.displayMessage(message, 'user');

            // Process the message and get response
            const response = await this.processMessage(message);

            // Display bot response
            this.displayMessage(response, 'bot');
        } catch (error) {
            console.error('Error handling message:', error);
            this.displayMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    async processMessage(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }

    displayMessage(message, type) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}-message`;
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

export default ChatAgent; 
} 