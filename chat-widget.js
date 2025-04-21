(function() {
  const container = document.getElementById('chat-widget-container');
  if (!container) return;

  const config = {
    webhook: container.dataset.webhook || 'https://api.example.com/chat',
    title: container.dataset.title || 'Chat Widget',
    agentName: container.dataset.agent || 'AI Assistant',
    color: container.dataset.color || '#007bff'
  };

  // Create elements
  const toggleCircle = document.createElement('div');
  toggleCircle.id = 'toggle-circle';
  toggleCircle.className = 'circle-icon';
  toggleCircle.textContent = '💬';
  toggleCircle.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${config.color};
    color: white;
    font-size: 1.2em;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;

  const chatBox = document.createElement('div');
  chatBox.id = 'chat-box';
  chatBox.className = 'hidden';
  chatBox.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    max-height: 500px;
    background: white;
    color: #333;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    transition: all 0.3s ease;
  `;

  const chatHeader = document.createElement('div');
  chatHeader.id = 'chat-header';
  chatHeader.style.cssText = `
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const chatTitle = document.createElement('span');
  chatTitle.id = 'chat-title';
  chatTitle.textContent = config.title;
  chatTitle.style.cssText = 'font-weight: bold; font-size: 1.1em; color: #2c3e50;';

  const closeButton = document.createElement('button');
  closeButton.id = 'close-btn';
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    background: none;
    border: none;
    font-size: 1.2em;
    color: #2c3e50;
    cursor: pointer;
    padding: 0 5px;
  `;

  // Append header elements
  chatHeader.appendChild(chatTitle);
  chatHeader.appendChild(closeButton);
  chatBox.appendChild(chatHeader);

  // Create message body
  const messageBody = document.createElement('div');
  messageBody.id = 'chat-body';
  messageBody.style.cssText = `
    padding: 15px;
    height: 80%;
    overflow-y: auto;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  `;
  chatBox.appendChild(messageBody);

  // Create input field
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'chat-input';
  input.placeholder = 'Type your message...';
  input.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    box-sizing: border-box;
    font-size: 1em;
  `;
  chatBox.appendChild(input);

  // Event listeners
  toggleCircle.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
    toggleCircle.classList.toggle('hidden');
  });

  closeButton.addEventListener('click', () => {
    chatBox.classList.add('hidden');
    toggleCircle.classList.remove('hidden');
  });

  input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      const message = input.value.trim();
      input.value = '';
      
      const userMessage = document.createElement('div');
      userMessage.className = 'user-message';
      userMessage.textContent = `You: ${message}`;
      messageBody.appendChild(userMessage);
      messageBody.scrollTop = messageBody.scrollHeight;

      try {
        const response = await fetch(config.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, agent_name: config.agentName })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const agentMessage = document.createElement('div');
        agentMessage.className = 'agent-message';
        agentMessage.textContent = `${config.agentName}: ${data.response}`;
        agentMessage.style.color = '#2c3e50';
        messageBody.appendChild(agentMessage);
        messageBody.scrollTop = messageBody.scrollHeight;
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Error sending message';
        messageBody.appendChild(errorMessage);
        messageBody.scrollTop = messageBody.scrollHeight;
      }
    }
  });

  // Append elements to container
  container.appendChild(toggleCircle);
  container.appendChild(chatBox);

  // Initial state
  chatBox.classList.add('hidden');
  toggleCircle.classList.remove('hidden');

  // Inject CSS dynamically
  const style = document.createElement('style');
  style.textContent = `
    .hidden {
      display: none !important;
    }

    .circle-icon {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${config.color};
      color: white;
      font-size: 1.2em;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }

    .chat-box {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      max-height: 500px;
      background: white;
      color: #333;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: all 0.3s ease;
    }

    #chat-header {
      padding: 10px 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #chat-title {
      font-weight: bold;
      font-size: 1.1em;
      color: #2c3e50;
    }

    #close-btn {
      background: none;
      border: none;
      font-size: 1.2em;
      color: #2c3e50;
      cursor: pointer;
      padding: 0 5px;
    }

    .message-container {
      padding: 15px;
      height: 80%;
      overflow-y: auto;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .user-message {
      background: #e8f4ff;
      padding: 8px 12px;
      border-radius: 20px;
      margin: 5px 0;
      max-width: 70%;
      align-self: flex-end;
    }

    .agent-message {
      background: #f0f4f8;
      padding: 8px 12px;
      border-radius: 20px;
      margin: 5px 0;
      max-width: 70%;
      align-self: flex-start;
    }

    .error-message {
      color: red;
      margin: 5px 0;
    }
  `;
  document.head.appendChild(style);
})();
