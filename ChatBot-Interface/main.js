// DOM Elements
const chatButton = document.getElementById('chatButton');
const chatInterface = document.getElementById('chatInterface');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImage = document.getElementById('removeImage');

let isTyping = false;
let currentImage = null;
let lastMessageId = 0;

// Mobile View Handler
function adjustMobileView() {
    if (window.innerWidth < 640) {
        chatInterface.style.bottom = chatInterface.classList.contains('active') ? '0' : '24px';
        chatInterface.style.right = chatInterface.classList.contains('active') ? '0' : '24px';
    }
}

window.addEventListener('resize', adjustMobileView);

// Chat Toggle
chatButton.addEventListener('click', () => {
    chatInterface.classList.add('active');
    chatButton.style.display = 'none';
    adjustMobileView();
    messageInput.focus();
});

closeChat.addEventListener('click', () => {
    chatInterface.classList.remove('active');
    chatButton.style.display = 'flex';
    adjustMobileView();
});

// Image Handler
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        imageInput.value = '';
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        imageInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('hidden');
        currentImage = file;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    reader.readAsDataURL(file);
});

removeImage.addEventListener('click', () => {
    imagePreview.classList.add('hidden');
    previewImg.src = '';
    imageInput.value = '';
    currentImage = null;
});

// Message Handler
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if ((!message && !currentImage) || isTyping) return;

    if (message || currentImage) {
        const messageId = ++lastMessageId;
        addMessage(message, 'user', currentImage ? previewImg.src : null, messageId);
        messageInput.value = '';
        
        if (currentImage) {
            imagePreview.classList.add('hidden');
            previewImg.src = '';
            imageInput.value = '';
            currentImage = null;
        }

        showTypingIndicator();
        await simulateBotResponse(message, messageId);
    }
});

function addMessage(text, sender, imageUrl = null, messageId) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message mb-4 flex gap-2 ${sender === 'user' ? 'flex-row-reverse' : ''}`;
    messageDiv.dataset.messageId = messageId;
    
    const avatar = sender === 'user' 
        ? `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-200 to-pink-300 flex items-center justify-center flex-shrink-0">
             <svg class="h-4 w-4 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
               <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
             </svg>
           </div>`
        : `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
             <svg class="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>
           </div>`;

    const content = `
        ${avatar}
        <div class="flex-1 rounded-xl p-3 ${sender === 'user' ? 'bg-gradient-to-r from-pink-50 to-pink-100' : 'bg-white border border-gray-100'}">
            ${imageUrl ? `<img src="${imageUrl}" alt="Uploaded" class="max-w-full rounded-lg max-h-40 object-contain mb-2">` : ''}
            ${text ? `<p class="text-gray-700">${text}</p>` : ''}
        </div>
    `;

    messageDiv.innerHTML = content;
    chatMessages.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message mb-4 flex gap-2';
    typingDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
            <svg class="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        </div>
        <div class="typing-indicator p-3 bg-white rounded-xl border border-gray-100">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    typingDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function removeTypingIndicator() {
    const typingContainer = document.querySelector('.typing-indicator')?.parentElement;
    if (typingContainer) {
        typingContainer.remove();
    }
    isTyping = false;
}

async function simulateBotResponse(userMessage, replyToId) {
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
    
    if (currentImage) {
        response = "I see your image! What would you like to know about it? 🖼️";
    }

    addMessage(response, 'bot', null, ++lastMessageId);
}

adjustMobileView();