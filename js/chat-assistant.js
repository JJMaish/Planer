import { BaseAgent } from './Agents/BaseAgent.js';

export class ChatAssistant extends BaseAgent {
    constructor() {
        super();
        this.name = 'ChatAssistant';
        this.messages = [];
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

    async initialize() {
        try {
            await super.initialize();
            console.log('ChatAssistant initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize ChatAssistant:', error);
            throw error;
        }
    }

    toggleChat() {
        this.chatContainer.classList.toggle('active');
        if (this.chatContainer.classList.contains('active')) {
            this.chatInput.focus();
        }
    }

    async sendMessage(message) {
        try {
            // Add user message to chat UI
            this.addMessageToUI(message, 'user');
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Get response from Groq
            const response = await this.getResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response to chat UI
            this.addMessageToUI(response, 'bot');
            
            return response;
        } catch (error) {
            console.error('Error in sendMessage:', error);
            this.hideTypingIndicator();
            this.addMessageToUI('Sorry, I encountered an error. Please try again.', 'bot');
            throw error;
        }
    }

    async getResponse(message) {
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

    addMessageToUI(message, type) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.textContent = 'Typing...';
        indicator.id = 'typingIndicator';
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
}
