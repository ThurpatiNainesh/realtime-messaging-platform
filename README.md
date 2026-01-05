# Slack-Style Messaging Backend (NestJS)

## Project Overview

This project is a **Slack-style real-time messaging backend** built using **NestJS**, **Socket.IO**, **PostgreSQL**, and **Redis**.

It supports:
- Multi-tenant workspaces (organizations)
- Channels within workspaces
- Real-time messaging using WebSockets
- Message persistence and pagination
- Secure JWT-based authentication
- Horizontal scalability using Redis Pub/Sub

The goal of this project is to demonstrate **real-time system design, clean API boundaries, authorization, and scalability thinking**, rather than UI or frontend concerns.

---

## Tech Stack & Versions

### Backend
- **Node.js**: v18+
- **NestJS**: v10+
- **TypeScript**: v5+

### Real-Time
- **Socket.IO**: v4.x
- **@nestjs/websockets**
- **@nestjs/platform-socket.io**

### Database
- **PostgreSQL**: v14+
- **TypeORM**: v0.3+

### Caching / Messaging
- **Redis**: v7.x
- Redis Pub/Sub for cross-instance event propagation

### Auth & Utilities
- **JWT** (JSON Web Tokens)
- **bcrypt**
- **class-validator**
- **class-transformer**

---

## Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd slack-style-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start PostgreSQL

Make sure PostgreSQL is running locally.

Create a database:

```sql
CREATE DATABASE slack_clone;
```

### 4. Start Redis

Using Docker (recommended):

```bash
docker run -d -p 6379:6379 redis
```

Or start Redis locally if already installed.

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=realtime_messaging
NODE_ENV=development

# Auth
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 6. Run the Application

```bash
npm run start:dev
```

Server will be available at: `http://localhost:3000`

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Application port |
| DB_HOST | PostgreSQL host |
| DB_PORT | PostgreSQL port |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| DB_NAME | Database name |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRES_IN | Token expiry |
| REDIS_HOST | Redis host |
| REDIS_PORT | Redis port |

---

## Architecture Decisions (Brief)

### 1. REST + WebSocket Separation

**REST APIs** are used for:
- Authentication
- Workspace & channel management
- Fetching message history

**WebSockets (Socket.IO)** are used only for:
- Real-time message delivery

This keeps the system clean, testable, and scalable.

### 2. Redis Pub/Sub for Scalability

- Socket.IO alone works only on a single server
- Redis Pub/Sub ensures:
  - Messages are broadcast across multiple backend instances
  - Horizontal scaling without sticky sessions

### 3. Database as Source of Truth

- All messages are persisted in PostgreSQL
- Redis is used only for event propagation, not storage
- Ensures durability and message ordering

### 4. Explicit Membership Authorization

- Socket room membership ≠ channel membership
- Channel membership is enforced at the database level
- Prevents unauthorized message sending

---

## Assumptions & Limitations

### Assumptions
- Users already exist or are created via a basic auth flow
- Single organization per workspace
- No frontend included (API-first design)

### Limitations
- No message editing or deletion
- No file uploads
- No push notifications
- No offline sync
- No message search indexing
- Read receipts are modeled but not fully wired to sockets

---

## What I Would Improve With More Time

### 1. Advanced Real-Time Features
- Read receipts (socket-driven)
- Typing indicators
- Online/offline presence
- Message acknowledgements (ACKs)

### 2. Performance & Reliability
- Cursor-based pagination everywhere
- Rate limiting for socket events
- Idempotent message handling
- Better Redis failure handling

### 3. Security Enhancements
- Role-based permissions (admin/moderator)
- Channel-level ACLs
- Invite-only private channels

### 4. DevOps & Observability
- Docker Compose for full stack
- Health checks
- Structured logging
- Metrics & tracing

---

## Final Notes

This project focuses on **backend architecture and real-time system design**, similar to how Slack-like systems are built in production.

Frontend and deployment are intentionally kept out of scope to highlight backend responsibilities clearly.