# Slack-Style Messaging Backend - API & WebSocket Documentation

## Base URL
```
http://localhost:3000
```

---

## 🔐 Authentication APIs

### 1. Register User

```bash
curl -X POST 'http://localhost:3000/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "id": "6358aeba-d687-4c5f-9140-7c9882766426",
  "email": "test@example.com"
}
```

---

### 2. Login User

```bash
curl -X POST 'http://localhost:3000/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Save the `accessToken` - you'll need it for all subsequent requests!**

---

## 👤 User APIs

### 3. Get Current User

```bash
curl -X GET 'http://localhost:3000/users/me' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**Response:**
```json
{
  "userId": "6358aeba-d687-4c5f-9140-7c9882766426",
  "email": "test@example.com"
}
```

---

## 🏢 Workspace APIs

### 4. Create Workspace

```bash
curl -X POST 'http://localhost:3000/workspaces' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My First Workspace"
  }'
```

**Response:**
```json
{
  "id": "ab239dd3-33e6-4bd6-a3d2-d2c1fed3f175",
  "name": "My First Workspace",
  "ownerId": "6358aeba-d687-4c5f-9140-7c9882766426",
  "createdAt": "2026-01-04T18:27:49.873Z"
}
```

**⚠️ Save the workspace `id` - you'll need it to create channels!**

---

## 📢 Channel APIs

### 5. Create Channel

```bash
curl -X POST 'http://localhost:3000/channels' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "workspaceId": "ab239dd3-33e6-4bd6-a3d2-d2c1fed3f175",
    "name": "team1"
  }'
```

**Response:**
```json
{
  "id": "835d0f50-2643-49c6-aa15-6cd2a3f48418",
  "workspaceId": "ab239dd3-33e6-4bd6-a3d2-d2c1fed3f175",
  "name": "team1",
  "isPrivate": false,
  "createdAt": "2026-01-04T20:17:41.378Z"
}
```

**⚠️ Save the channel `id` - you'll need it for WebSocket messaging!**

---

### 6. List All Channels

```bash
curl -X GET 'http://localhost:3000/channels' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**Response:**
```json
[
  {
    "id": "835d0f50-2643-49c6-aa15-6cd2a3f48418",
    "workspaceId": "ab239dd3-33e6-4bd6-a3d2-d2c1fed3f175",
    "name": "team1",
    "isPrivate": false,
    "createdAt": "2026-01-04T20:17:41.378Z"
  }
]
```

---

## 💬 WebSocket Events (Socket.IO)

### Connection Setup

**WebSocket URL:**
```
ws://localhost:3000
```

**Connect with Authentication:**

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_ACCESS_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
});
```

---

### Event 1: Join Channel

**Event Name:** `join_channel`

**Emit:**
```javascript
socket.emit('join_channel', '835d0f50-2643-49c6-aa15-6cd2a3f48418', (response) => {
  console.log('Response:', response);
});
```

**Response:**
```json
{
  "success": true,
  "channel": "835d0f50-2643-49c6-aa15-6cd2a3f48418"
}
```

---

### Event 2: Send Message

**Event Name:** `send_message`

**Emit:**
```javascript
socket.emit('send_message', {
  channelId: '835d0f50-2643-49c6-aa15-6cd2a3f48418',
  content: 'Hello, team!'
}, (response) => {
  console.log('Response:', response);
});
```

**Response:**
```json
{
  "success": true,
  "messageId": "message-uuid-here"
}
```

---

### Event 3: Receive Message (Listen)

**Event Name:** `receive_message`

**Listen:**
```javascript
socket.on('receive_message', (message) => {
  console.log('📩 New message received:', message);
});
```

**Message Format:**
```json
{
  "id": "message-uuid",
  "channelId": "835d0f50-2643-49c6-aa15-6cd2a3f48418",
  "userId": "6358aeba-d687-4c5f-9140-7c9882766426",
  "content": "Hello, team!",
  "createdAt": "2026-01-04T20:30:00.000Z"
}
```

---

## 🧪 Complete Testing Flow

### Step 1: Register & Login
```bash
# Register
curl -X POST 'http://localhost:3000/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@test.com","password":"pass123"}'

# Login (save the token!)
curl -X POST 'http://localhost:3000/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@test.com","password":"pass123"}'
```

### Step 2: Create Workspace
```bash
curl -X POST 'http://localhost:3000/workspaces' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Workspace"}'
```

### Step 3: Create Channel
```bash
curl -X POST 'http://localhost:3000/channels' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"workspaceId":"YOUR_WORKSPACE_ID","name":"general"}'
```

### Step 4: Connect WebSocket & Send Messages

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => {
  console.log('✅ Connected');
  
  // Join channel
  socket.emit('join_channel', 'YOUR_CHANNEL_ID');
  
  // Listen for messages
  socket.on('receive_message', (msg) => {
    console.log('📩 Message:', msg);
  });
  
  // Send message
  socket.emit('send_message', {
    channelId: 'YOUR_CHANNEL_ID',
    content: 'Hello World!'
  });
});
```

---

## 🔧 Testing with Postman

### Import Collection

Create a Postman collection with these variables:
- `base_url`: `http://localhost:3000`
- `token`: (set after login)
- `workspace_id`: (set after creating workspace)
- `channel_id`: (set after creating channel)

### Test Sequence:
1. **POST** `/auth/register`
2. **POST** `/auth/login` → Save `accessToken` to `{{token}}`
3. **GET** `/users/me`
4. **POST** `/workspaces` → Save `id` to `{{workspace_id}}`
5. **POST** `/channels` → Save `id` to `{{channel_id}}`
6. **GET** `/channels`
7. Use Socket.IO client for real-time messaging

---

## 📝 Notes

- Replace `YOUR_ACCESS_TOKEN` with actual token from login
- Replace `YOUR_WORKSPACE_ID` with actual workspace ID
- Replace `YOUR_CHANNEL_ID` with actual channel ID
- All authenticated endpoints require `Authorization: Bearer TOKEN` header
- WebSocket connection requires JWT token in auth object