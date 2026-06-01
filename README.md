# Pairloop - Interview & Collaborative Coding Platform

Pairloop is a full-stack technical interview platform built for real-time collaborative coding, video interviews, screen sharing, scheduling, chat, notifications, and candidate evaluation workflows.

It combines a modern React frontend with a scalable Express/MongoDB backend, Socket.IO real-time communication, WebRTC signaling, Monaco Editor, JWT authentication, and production-focused backend architecture.

## Live Demo

- Frontend: https://interview-platform-frontend.pages.dev/
- Backend API: https://interview-platform-server-xgwn.onrender.com

> Note: The backend may take a few seconds to wake up if hosted on a free Render instance.

## Features

- User authentication with JWT access and refresh token flow
- Protected dashboard and profile management
- Create, join, leave, and manage interview rooms
- Host admission flow for first-time room participants
- Real-time participant tracking
- WebRTC video and audio interview support
- Screen sharing with interviewer-focused visibility
- Collaborative Monaco code editor
- Real-time editor synchronization
- Language switching
- Code execution with resizable output panel
- Standalone coding playground
- Save and Save As playground files
- Load saved playground files from user history
- Real-time room chat
- Persistent chat messages
- Notification system with read/unread state
- Schedule interview workflow
- Room-linked teammate invite emails
- Screenshot upload support using Multer
- Daily cleanup cron jobs for old interviews and read notifications
- Secure backend middleware with Helmet, CORS, rate limiting, and request sanitization

## Tech Stack

### Frontend

- React.js
- Redux Toolkit
- React Router
- Tailwind CSS
- Monaco Editor
- Socket.IO Client
- Lucide React
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- WebRTC signaling
- JWT Authentication
- Bcrypt
- Joi Validation
- Multer
- Nodemailer
- Node Cron
- Helmet
- CORS
- Express Rate Limit
- Winston Logger

Architecture Overview
Pairloop follows a modular MVC-style backend architecture.

Backend Architecture
models/ - Mongoose schemas and database models
modules/ - Feature-based controller, service, route, and validator logic
middlewares/ - Authentication, validation, security, error handling, logging
sockets/ - Socket.IO connection and room event handlers
config/ - Environment, database, CORS, and socket configuration
utils/ - Shared helpers, logger, async handlers, and response utilities
Frontend Architecture
pages/ - Route-level screens
components/ - Reusable UI components
features/ - Redux feature slices
services/ - API service modules
lib/ - API client, socket client, auth helpers, utilities
store/ - Redux store configuration
Getting Started
Prerequisites
Make sure you have installed:

Node.js 20+
npm
MongoDB Atlas account or local MongoDB instance
Installation
Clone the repository:
git clone https://github.com/AneesIbnuKasim/Interview-Platform-Frontend.git
cd Interview-Platform-Frontend

Core Modules
Authentication
Register
Login
Logout
Refresh token
Protected routes
Profile fetching
JWT access and refresh token flow
Interview Rooms
Create room
Join room
Leave room
Host admission control
Participant tracking
Room persistence
Room status handling
Real-Time Collaboration
Socket.IO room events
Participant join/leave events
Editor synchronization
Language switching
Chat messages
Notifications
Reconnect handling
WebRTC Signaling
Offer exchange
Answer exchange
ICE candidate exchange
Microphone toggle
Camera toggle
Screen share start/stop events
Code Editor
Monaco Editor integration
Collaborative room editor
Code execution
Resizable output panel
Language selection
Editor state persistence
Playground
Standalone coding playground
Save file
Save As file
Load saved files
Persist code, language, and stdin
Fullscreen editor mode
Notifications
Socket-based notifications
Persistent notifications
Read/unread state
Automatic cleanup of read notifications after retention period
Scheduling
Schedule interview
View upcoming and recent interviews
Room-based scheduling workflow
Team Invitations
Send room-linked invite emails
Include room title, room code, and direct room link
Invite history
Resend invite
Room creator admission remains the final access gate
API Overview

Security Features
JWT authentication
Password hashing with Bcrypt
Protected API routes
Joi request validation
Helmet security headers
CORS configuration
Rate limiting
Request sanitization
Centralized error handling
Environment-based configuration
Deployment
Recommended deployment setup:

Frontend: Cloudflare Pages
Backend: Render, Koyeb, Railway, or any WebSocket-friendly Node.js host
Database: MongoDB Atlas
Uploads: Local storage for development, S3-compatible storage for production

Author
Anees M

LinkedIn: 
https://www.linkedin.com/in/anees-mangalodan/
GitHub: 
https://github.com/AneesIbnuKasim
Portfolio: 
https://aneesmangaloden.vercel.app/
