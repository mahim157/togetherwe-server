# TogetherWe | Backend API

This repository contains the backend API for TogetherWe, a community-driven social development and events platform.

The backend provides RESTful APIs for user authentication, event management, volunteer participation, bookmarks, and event discussions.

## 🌐 Project Links

- **Live Website:** [Add your Vercel URL]
- **Client Repository:** https://github.com/mahim157/togetherwe-client
- **Server Repository:** https://github.com/mahim157/togetherwe-server

## ✨ Backend Features

- **Authentication:** Better Auth integration with JWT-based API authentication.
- **Event Management:** Create, retrieve, update, and delete community events.
- **Event Discovery:** Retrieve upcoming events and recent events.
- **Volunteer Participation:** Join events and track volunteer counts.
- **Joined Events:** Retrieve events joined by the authenticated user.
- **Manage Events:** Allow users to manage their own events.
- **Event Bookmarks:** Save and remove bookmarked events.
- **Event Discussions:** Create and retrieve comments for events.
- **Comment Management:** Edit and delete comments with ownership verification.
- **Protected APIs:** Secure private endpoints using JWT verification.
- **Data Validation:** Validate event details, dates, image URLs, and comment content.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Better Auth | Authentication |
| JOSE | JWT verification |
| MongoDB Driver | Database operations |
| JavaScript ES Modules | Modular backend structure |

## 📁 Project Structure

```text
server/
├── config/
│   ├── auth.js
│   └── db.js
├── controllers/
│   └── eventController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── Event.js
├── routes/
│   └── events.js
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mahim157/togetherwe-server.git
```

### 2. Navigate to the Project

```bash
cd togetherwe-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the server root directory.

Configure the following environment variables using your own credentials:

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
BETTER_AUTH_SECRET=YOUR_SECRET
BETTER_AUTH_URL=http://localhost:5000

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
```

Use the exact MongoDB variable name referenced in your database configuration if it differs from `MONGODB_URI`.

Never commit `.env` or expose database credentials, OAuth secrets, or authentication tokens.

### 5. Start Development Server

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

## 📡 API Documentation

Base URL:

```text
http://localhost:5000/api/events
```

### Public Event Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all events |
| GET | `/recent` | Retrieve recent events |
| GET | `/:id` | Retrieve event details |
| GET | `/:id/comments` | Retrieve event comments |

### Protected Event Routes

These endpoints require a valid JWT token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create an event |
| POST | `/:id/join` | Join an event |
| GET | `/joined` | Retrieve joined events |
| GET | `/my-events` | Retrieve user's own events |
| PUT | `/:id` | Update an owned event |
| DELETE | `/:id` | Delete an owned event |
| GET | `/bookmarked` | Retrieve saved events |
| POST | `/:id/bookmark` | Bookmark an event |
| DELETE | `/:id/bookmark` | Remove a bookmark |

### Event Discussion Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:id/comments` | Get comments |
| POST | `/:id/comments` | Add a comment |
| PUT | `/:id/comments/:commentId` | Edit own comment |
| DELETE | `/:id/comments/:commentId` | Delete own comment |

### Authentication

Protected endpoints require the following HTTP header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The backend verifies JWT signatures using Better Auth's JWKS endpoint.

## 🗄️ Database Collections

The backend uses MongoDB collections for:

- `events` — Community event information.
- `eventJoins` — Volunteer participation records.
- `eventBookmarks` — User bookmarked events.
- `eventComments` — Event discussion comments.

Better Auth also manages its authentication-related database records.

## 🔒 Security and Validation

- JWT authentication for protected endpoints.
- Ownership verification for event updates and deletion.
- Ownership verification for comment editing and deletion.
- Event input validation.
- Future-date validation for newly created events.
- Comment length validation.
- Environment variables for sensitive configuration.

## 🚀 Production Deployment

The backend is designed to be deployed on Render.

Before deployment:

1. Configure the production MongoDB connection.
2. Add the required environment variables.
3. Configure the production Better Auth URL.
4. Update trusted origins for the deployed frontend.
5. Configure Google and GitHub OAuth callback URLs.
6. Verify the production API endpoints.

## 👨‍💻 Developer

**Moynol Islam Mahim**

- GitHub: https://github.com/mahim157
- LinkedIn: https://www.linkedin.com/in/md-moynol-islam-mahim

---

*TogetherWe — Connecting People, Creating Positive Change.*
