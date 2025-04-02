class ChatAgent {
    constructor() {
        this.basePrompt = `As a knowledgeable Bruges travel assistant, I can help you with:
- Planning your itinerary
- Finding attractions and restaurants
- Getting directions
- Local tips and recommendations
- Travel advice`;
    }

    async processMessage(message) {
        try {
            const prompt = this.createPrompt(message);
            const response = await this.callDeepSeek(prompt);
            return this.formatResponse(response);
        } catch (error) {
            console.error('Chat processing error:', error);
            return 'I apologize, but I encountered an error. Please try again.';
        }
    }

    createPrompt(message) {
        return `${this.basePrompt}\n\nUser: ${message}\n\nAssistant:`;
    }

    async callDeepSeek(prompt) {
        try {
            const response = await fetch('YOUR_DEEPSEEK_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('DeepSeek API call failed');
            }

            const data = await response.json();
            return data.choices[0].text;
        } catch (error) {
            console.error('DeepSeek API error:', error);
            throw error;
        }
    }

    formatResponse(response) {
        return response.trim();
    }
} 