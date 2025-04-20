(function() {
  const container = document.getElementById('chat-widget');
  if (!container) return;

  const config = {
    webhook: container.dataset.webhook || 'https://api.example.com/chat',
    title: container.dataset.title || 'Chat Widget',
    agentName: container.dataset.agent || 'AI Assistant',
    color: container.dataset.color || '#007bff'
  };

  const widget = document.createElement('div');
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${config.color};
    color: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
  `;

  // Header
  const header = document.createElement('div');
  header.textContent = config.title;
  header.style.cssText = 'padding: 8px 12px; color: #333; border-bottom: 1px solid #ddd;';
  widget.appendChild(header);

  // Message body
  const messageBody = document.createElement('div');
  messageBody.style.cssText = 'max-height: 300px; overflow-y: auto; padding: 10px; margin-bottom: 10px;';
  widget.appendChild(messageBody);

  // Input field
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your message...';
  input.style.cssText = `
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  `;
  widget.appendChild(input);

  // Footer
  const footer = document.createElement('div');
  footer.textContent = 'Powered by kmonlinesolutions';
  footer.style.cssText = 'padding: 8px 12px; color: #666; border-top: 1px solid #ddd;';
  widget.appendChild(footer);

  container.innerHTML = '';
  container.appendChild(widget);

  input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      const message = input.value.trim();
      input.value = '';
      
      const userMessage = document.createElement('div');
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
        agentMessage.textContent = `${config.agentName}: ${data.response}`;
        agentMessage.style.color = '#333';
        messageBody.appendChild(agentMessage);
        messageBody.scrollTop = messageBody.scrollHeight;
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error sending message';
        errorMessage.style.color = 'red';
        messageBody.appendChild(errorMessage);
        messageBody.scrollTop = messageBody.scrollHeight;
      }
    }
  });
})();