// DOM Elements
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');

let isTyping = false;

// Initial message
addMessage("Hi! How can I help you today? 👋", 'bot');

// Message Handler
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';

    // Show bot is typing
    showTypingIndicator();
    
    // Simulate bot response
    await simulateBotResponse(message);
});

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''} message`;
    
    const avatar = sender === 'user' 
        ? `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-200 to-pink-300 flex items-center justify-center flex-shrink-0">
             <svg class="w-4 h-4 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
               <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
             </svg>
           </div>`
        : `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
             <svg class="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>
           </div>`;

    messageDiv.innerHTML = `
        ${avatar}
        <div class="flex-1 ${sender === 'user' ? 'bg-gradient-to-r from-pink-50 to-pink-100' : 'bg-white border border-gray-100'} rounded-2xl p-3 shadow-sm">
            <p class="text-gray-700">${text}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex gap-3 message';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        </div>
        <div class="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = chatMessages.querySelector('.typing-dots')?.closest('.message');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

async function simulateBotResponse(userMessage) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    removeTypingIndicator();

    const responses = {
        'hello': 'Hi there! How can I help you today? 👋',
        'hi': 'Hello! What can I do for you? 😊',
        'help': 'I\'m here to help! What would you like to know? 💡',
        'bye': 'Goodbye! Have a great day! 👋',
        'thanks': 'You\'re welcome! Let me know if you need anything else! 😊',
        'thank you': 'You\'re welcome! Is there anything else I can help with? 🌟'
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses[lowerMessage] || 'How can I assist you with that? 💭';
    
    addMessage(response, 'bot');
}