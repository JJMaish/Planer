document.addEventListener('DOMContentLoaded', () => {
    const chatAgent = new ChatAgent();
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    const minimizeButton = document.querySelector('.minimize-chat');
    const messagesContainer = document.querySelector('.chat-messages');

    // Initialize chat visibility
    chatContainer.classList.add('hidden');

    // Toggle chat
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        chatToggle.style.display = 'none';
        chatInput.focus();
    });

    // Minimize chat
    minimizeButton.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        chatToggle.style.display = 'flex';
    });

    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            // Get AI response
            const response = await chatAgent.processMessage(message);
            
            // Remove typing indicator and show response
            hideTypingIndicator();
            addMessage(response, 'bot');
        } catch (error) {
            hideTypingIndicator();
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    // Enter key press
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Helper functions
    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>
            <div class="message-content">${content}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}); 