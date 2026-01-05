<!DOCTYPE html>
<html>
<head>
  <title>Two-Way WebSocket Chat</title>
  <!-- Socket.IO client library - handles real-time communication -->
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
  <style>
    /* Reset default browser styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Main body styling with gradient background */
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    /* Main chat container */
    .chat-container {
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 600px;
      height: 700px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header section with title and connection status */
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }

    .chat-header h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    /* Status bar showing connection state */
    .status-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 14px;
    }

    /* Animated dot indicator for connection status */
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff4444; /* Red when disconnected */
      animation: pulse 2s infinite;
    }

    .status-indicator.connected {
      background: #00ff88; /* Green when connected */
    }

    /* Pulsing animation for status indicator */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Connection panel for username and token input */
    .connection-panel {
      padding: 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .connection-panel input {
      width: 100%;
      padding: 12px;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .connection-panel input:focus {
      outline: none;
      border-color: #667eea;
    }

    .connection-panel button {
      width: 100%;
      padding: 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .connection-panel button:hover {
      background: #5568d3;
    }

    .connection-panel button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    /* Messages container - scrollable area */
    #messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f8f9fa;
    }

    /* Individual message wrapper */
    .message {
      margin-bottom: 15px;
      animation: slideIn 0.3s ease-out;
    }

    /* Slide-in animation for new messages */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Message bubble styling */
    .message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      max-width: 70%;
      word-wrap: break-word;
      position: relative;
    }

    /* Sent messages (your messages) - purple bubble on right */
    .message.sent .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }

    /* Received messages (others' messages) - white bubble on left */
    .message.received .message-bubble {
      background: white;
      color: #333;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    /* System messages (connection status, etc.) - yellow bubble centered */
    .message.system .message-bubble {
      background: #fff3cd;
      color: #856404;
      margin: 0 auto;
      border-radius: 18px;
      max-width: 90%;
      text-align: center;
      font-size: 13px;
    }

    /* Timestamp and metadata styling */
    .message-info {
      font-size: 11px;
      margin-top: 5px;
      opacity: 0.7;
    }

    .message.sent .message-info {
      text-align: right;
      color: #667eea;
    }

    .message.received .message-info {
      text-align: left;
      color: #666;
    }

    /* Message content text */
    .message-content {
      margin-bottom: 3px;
      line-height: 1.4;
    }

    /* Sender name (for received messages) */
    .sender-name {
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 5px;
      opacity: 0.8;
    }

    /* Input area at bottom for typing messages */
    .input-container {
      padding: 20px;
      background: white;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 10px;
    }

    .input-container input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #dee2e6;
      border-radius: 25px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .input-container input:focus {
      outline: none;
      border-color: #667eea;
    }

    .input-container button {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .input-container button:hover {
      transform: scale(1.05);
    }

    .input-container button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <!-- Header with title and connection status -->
    <div class="chat-header">
      <h1>💬 Real-Time Chat</h1>
      <div class="status-bar">
        <div id="statusIndicator" class="status-indicator"></div>
        <span id="statusText">Disconnected</span>
      </div>
    </div>

    <!-- Connection panel - for entering username and JWT token -->
    <div id="connectionPanel" class="connection-panel">
      <input 
        type="text" 
        id="usernameInput" 
        placeholder="Enter your name"
        value="User"
      >
      <input 
        type="text" 
        id="tokenInput" 
        placeholder="Paste your JWT token here"
      >
      <button onclick="connect()">Connect to Chat</button>
    </div>

    <!-- Messages display area -->
    <div id="messages"></div>

    <!-- Message input area -->
    <div class="input-container">
      <input 
        type="text" 
        id="messageInput" 
        placeholder="Type a message..." 
        onkeypress="if(event.key==='Enter') sendMessage()"
        disabled
      >
      <button onclick="sendMessage()" id="sendBtn" disabled>Send</button>
    </div>
  </div>

  <script>
    // ============================================================
    // CONFIGURATION
    // ============================================================
    
    // Server URL where your WebSocket server is running
    const SERVER_URL = 'https://selected-auction-columnists-plymouth.trycloudflare.com';
    
    // Channel ID that all users will join to chat together
    const CHANNEL_ID = '835d0f50-2643-49c6-aa15-6cd2a3f48418';
    
    // ============================================================
    // GLOBAL VARIABLES
    // ============================================================
    
    let socket = null;        // Socket.IO connection object
    let username = 'User';    // Current user's display name
    let myUserId = null;      // Current user's unique ID (assigned by server)

    // ============================================================
    // CONNECT TO SERVER
    // ============================================================
    
    /**
     * Establishes connection to the WebSocket server
     * Called when user clicks "Connect to Chat" button
     */
    function connect() {
      // Get values from input fields
      const token = document.getElementById('tokenInput').value.trim();
      username = document.getElementById('usernameInput').value.trim() || 'User';
      
      // Validate token input
      if (!token) {
        alert('Please enter your JWT token!');
        return;
      }

      // Disconnect existing connection if any
      if (socket) {
        socket.disconnect();
      }

      // Show connection attempt message
      addMessage('system', '🔄 Connecting to server...');

      // Create new Socket.IO connection
      socket = io(SERVER_URL, {
        auth: { token: token },  // Send JWT token for authentication
        transports: ['websocket', 'polling']  // Try WebSocket first, fall back to polling
      });

      // ============================================================
      // EVENT LISTENERS
      // ============================================================

      /**
       * Triggered when successfully connected to server
       */
      socket.on('connect', () => {
        console.log('✅ Connected to server');
        updateStatus(true);
        addMessage('system', `✅ Connected as ${username}!`);
        
        // Automatically join the chat channel
        socket.emit('join_channel', CHANNEL_ID);
        addMessage('system', '📡 Joining chat channel...');
        
        // Enable message input now that we're connected
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
      });

      /**
       * Triggered when disconnected from server
       */
      socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        updateStatus(false);
        addMessage('system', '❌ Disconnected from server');
        
        // Disable message input when disconnected
        document.getElementById('messageInput').disabled = true;
        document.getElementById('sendBtn').disabled = true;
      });

      /**
       * Triggered when connection fails
       */
      socket.on('connect_error', (error) => {
        console.error('⚠️ Connection error:', error);
        addMessage('system', `⚠️ Connection error: ${error.message}`);
        updateStatus(false);
      });

      /**
       * Triggered when receiving a message broadcast from server
       * This is sent to ALL users in the channel including the sender
       */
      socket.on('receive_message', (message) => {
        console.log('📨 Received message broadcast:', message);
        
        // IMPORTANT: Don't display our own messages again
        // We already showed them as "sent" when we clicked Send
        // Only show messages from OTHER users
        if (message.senderId === myUserId) {
          console.log('⏭️ Skipping own message (already displayed as sent)');
          return;
        }
        
        // Display message from another user
        addMessage('received', message.content, {
          senderId: message.senderId,
          timestamp: message.createdAt
        });
      });

      /**
       * Listen for ALL events from server (useful for debugging)
       * This helps us see what the server is sending back
       */
      socket.onAny((event, data) => {
        console.log(`📡 Event received: ${event}`, data);
        
        // Handle successful channel join
        if (data && data.success && data.channel) {
          addMessage('system', '✅ Joined channel successfully!');
        }
        
        // Handle successful message send
        // The server sends back our userId when we send a message
        if (data && data.success && data.messageId && data.senderId) {
          console.log('✅ Message sent successfully, messageId:', data.messageId);
          
          // CRITICAL: Store our user ID on first message
          // This is how we know which messages are ours
          if (!myUserId) {
            myUserId = data.senderId;
            console.log('📝 My user ID is:', myUserId);
          }
        }
      });
    }

    // ============================================================
    // SEND MESSAGE
    // ============================================================
    
    /**
     * Sends a message to the server
     * Called when user clicks Send button or presses Enter
     */
    function sendMessage() {
      // Check if connected
      if (!socket || !socket.connected) {
        alert('Please connect first!');
        return;
      }

      // Get message text
      const input = document.getElementById('messageInput');
      const content = input.value.trim();
      
      // Don't send empty messages
      if (!content) return;
      
      console.log('📤 Sending message:', content);
      
      // Send message to server
      // Server will broadcast this to ALL users in the channel
      socket.emit('send_message', {
        channelId: CHANNEL_ID,
        content: content
      });
      
      // Show message immediately in UI as "sent" (optimistic update)
      // This gives instant feedback to the user
      // We won't show it again when the broadcast comes back
      addMessage('sent', content, {
        senderId: 'You',
        timestamp: new Date().toISOString()
      });
      
      // Clear input field
      input.value = '';
    }

    // ============================================================
    // UI HELPER FUNCTIONS
    // ============================================================
    
    /**
     * Adds a message to the chat display
     * @param {string} type - 'sent', 'received', or 'system'
     * @param {string} text - Message content
     * @param {object} data - Optional metadata (senderId, timestamp)
     */
    function addMessage(type, text, data = null) {
      const messagesDiv = document.getElementById('messages');
      const messageEl = document.createElement('div');
      messageEl.className = `message ${type}`;
      
      const timestamp = new Date().toLocaleTimeString();
      
      let messageHTML = '';
      
      // System message (connection status, etc.)
      if (type === 'system') {
        messageHTML = `
          <div class="message-bubble">
            ${text}
          </div>
        `;
      } 
      // Sent message (your message - right side, purple)
      else if (type === 'sent') {
        messageHTML = `
          <div class="message-bubble">
            <div class="message-content">${text}</div>
          </div>
          <div class="message-info">${timestamp}</div>
        `;
      } 
      // Received message (other user's message - left side, white)
      else if (type === 'received') {
        // Show first 8 characters of sender ID as name
        const senderName = data?.senderId ? `User ${data.senderId.substring(0, 8)}` : 'Someone';
        messageHTML = `
          <div class="message-bubble">
            <div class="sender-name">${senderName}</div>
            <div class="message-content">${text}</div>
          </div>
          <div class="message-info">${timestamp}</div>
        `;
      }
      
      messageEl.innerHTML = messageHTML;
      messagesDiv.appendChild(messageEl);
      
      // Auto-scroll to bottom to show new message
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    /**
     * Updates the connection status indicator
     * @param {boolean} connected - Whether currently connected
     */
    function updateStatus(connected) {
      const indicator = document.getElementById('statusIndicator');
      const statusText = document.getElementById('statusText');
      
      if (connected) {
        indicator.classList.add('connected');  // Green dot
        statusText.textContent = 'Connected';
      } else {
        indicator.classList.remove('connected');  // Red dot
        statusText.textContent = 'Disconnected';
      }
    }
  </script>
</body>
</html>