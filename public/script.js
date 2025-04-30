document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const nameForm = document.getElementById('name-form');
  const chatForm = document.getElementById('chat-form');
  const nameInput = document.getElementById('name-input');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const themeToggle = document.querySelector('.theme-toggle');
  const clearChatBtn = document.querySelector('.clear-chat');
  const typingIndicator = document.querySelector('.typing-indicator');
  
  // State
  let userName = '';

  // Theme Toggle
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });

  // Clear Chat
  clearChatBtn.addEventListener('click', function() {
    const messages = chatBox.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
  });

  // Handle Name Form Submission
  nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    userName = nameInput.value.trim();
    
    if (userName) {
      // Hide welcome message
      const welcomeMsg = chatBox.querySelector('.chat-welcome');
      if (welcomeMsg) welcomeMsg.remove();

      // Hide name form and show chat form
      nameForm.parentElement.style.display = 'none';
      chatForm.style.display = 'flex';
      chatForm.parentElement.style.display = 'block';

      // Add AI welcome message
      addMessage(`Hello **${userName}**! 👋`, 'ai');

      // Focus on chat input
      userInput.focus();
    }
  });

  // Handle Chat Form Submission
  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const message = userInput.value.trim();
    
    if (message) {
      // Add user message to chat
      addMessage(message, 'user');

      // Clear input
      userInput.value = '';

      // Show typing indicator
      showTypingIndicator();

      try {
        // API call to your backend
        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // Hide typing indicator
        hideTypingIndicator();

        // Add AI message to chat
        addMessage(data.reply, 'ai');
      } catch (error) {
        hideTypingIndicator();
        addMessage('**Sorry, something went wrong.**', 'ai', true);
      }
    }
  });

  // Add Message to Chat
  function addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';

    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fa-solid ${avatarIcon}"></i>
      </div>
      <div class="message-container">
        <div class="message-content" style="${isError ? 'color: red;' : ''}">${marked.parse(text)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;

    chatBox.appendChild(messageDiv);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Hide Typing Indicator
  function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
  }
});
