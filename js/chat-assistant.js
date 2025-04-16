import { BaseAgent } from './agents/BaseAgent.js';

class ChatAssistant extends BaseAgent {
    constructor() {
        super();
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
        Please provide accurate and helpful information about Bruges based on the following question: ${message}
        
        Focus on:
        1. Historical facts and context
        2. Tourist attractions and landmarks
        3. Cultural information
        4. Practical advice
        5. Local tips and recommendations
        
        Keep your response concise but informative.`;

        try {
            const response = await this._generateResponse(prompt);
            return response;
        } catch (error) {
            console.error('Error generating AI response:', error);
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