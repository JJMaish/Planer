class ChatAssistant {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.chatToggle = document.getElementById('chatToggle');
        this.closeChat = document.getElementById('closeChat');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.messageHistory = [];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.closeChat.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        if (this.chatContainer.classList.contains('active')) {
            this.chatInput.focus();
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.getAIResponse(message);
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        } finally {
            this.hideTypingIndicator();
        }
    }

    async getAIResponse(message) {
        const prompt = `You are a knowledgeable tour guide for Bruges, Belgium. 
            The user has asked: "${message}"
            
            Please provide a helpful, accurate response about Bruges. 
            Focus on:
            - Historical facts
            - Tourist attractions
            - Cultural information
            - Practical advice
            - Local tips
            
            Keep your response concise but informative.`;

        const systemPrompt = `You are a friendly, knowledgeable tour guide for Bruges, Belgium.
            You have extensive knowledge about:
            - The city's history and architecture
            - Tourist attractions and landmarks
            - Local culture and traditions
            - Best places to visit
            - Practical travel information
            
            Provide accurate, helpful information while maintaining a conversational tone.
            If asked about something outside of Bruges, politely redirect to Bruges-related topics.`;

        try {
            const response = await window.groqService.generateResponse(prompt, systemPrompt);
            return response;
        } catch (error) {
            console.error('Error getting AI response:', error);
            throw error;
        }
    }

    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('active');
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }
}

// Initialize chat assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatAssistant = new ChatAssistant();
}); 