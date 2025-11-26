# Event Booking System 🎟️

A full-stack event booking platform with real-time updates, payment integration, and role-based access control.

## Features ✨

- 🔐 JWT Authentication with role-based access (User, Organizer, Admin)
- 📅 Event CRUD operations
- 🔍 Advanced search & filters
- 🎫 Real-time ticket booking with seat locking
- 💳 Payment integration (Stripe/Razorpay)
- 🔔 WebSocket real-time updates
- ⭐ Reviews & ratings
- 📊 Admin dashboard with analytics
- 📧 Email/SMS notifications

## Tech Stack 🛠️

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT + Bcrypt
- Redis (optional)
- Stripe/Razorpay
- Nodemailer/Twilio

### Frontend
- React 18 + Vite
- Redux Toolkit
- React Query
- TailwindCSS
- React Hook Form
- Socket.io Client

## Setup Instructions 🚀

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file (use `.env.example` as template)

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## API Endpoints 📡

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

## Environment Variables 🔑

See `.env.example` files in both backend and frontend directories.

## Deployment 🌐

### Backend
- Deploy to Railway, Render, or AWS EC2
- Use MongoDB Atlas for database
- Configure environment variables

### Frontend
- Deploy to Vercel or Netlify
- Update API URLs

## License 📄

MIT
