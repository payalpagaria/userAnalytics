# userAnalytics

A backend service to capture, store, and analyze user interaction events (page views, clicks) and provide aggregation-driven analytics.

---

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Description

This project collects user interaction events at the session level and exposes endpoints to ingest events and query analytics such as session summaries, click heatmaps, and pages ranked by activity.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| Zod | Request validation |

---

## Quick Start

### Prerequisites

- Node.js v16+
- MongoDB instance (local or cloud URI)

### Installation

```bash
git clone https://github.com/payalpagaria/userAnalytics.git
cd userAnalytics
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### Run

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (development) |

---

## API Reference

Base URL: `/api/events`

### Create Event

```
POST /api/events
```

**Page View Event:**

```json
{
  "session_id": "sess_123",
  "event_type": "page_view",
  "page_url": "https://yoursite.com/home"
}
```

**Click Event:**

```json
{
  "session_id": "sess_123",
  "event_type": "click",
  "page_url": "https://yoursite.com/pricing",
  "click_coordinates": { "x": 420, "y": 315 }
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

---

### Get All Sessions

```
GET /api/events/sessions
```

Returns all sessions with event counts and summary stats.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "session_id": "sess_123",
      "eventCount": 15,
      "start_time": "2026-01-09T10:00:00.000Z",
      "end_time": "2026-01-09T10:30:00.000Z",
      "duration": 1800,
      "status": "Active",
      "views": 10,
      "clicks": 5
    }
  ]
}
```

---

### Get Session Events

```
GET /api/events/session/:sessionId
```

Returns all events for a specific session.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "session_id": "sess_123",
      "event_type": "click",
      "page_url": "https://yoursite.com/home",
      "click_coordinates": { "x": 100, "y": 200 },
      "timestamp": "2026-01-09T10:05:00.000Z"
    }
  ]
}
```

---

### Get Heatmap Pages

```
GET /api/events/heatmap/pages
```

Returns all unique page URLs with click data, sorted by click count.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "page_url": "https://yoursite.com/dashboard",
      "click_count": 156,
      "last_activity": "2026-01-09T10:30:00.000Z"
    },
    {
      "page_url": "https://yoursite.com/settings",
      "click_count": 42,
      "last_activity": "2026-01-09T09:15:00.000Z"
    }
  ]
}
```

---

### Get Click Heatmap for Page

```
GET /api/events/clicks/heatmap?page_url=<encoded_url>
```

Returns aggregated click coordinates for a specific page.

> **Note:** The `page_url` query parameter should be URL-encoded. The backend will decode it automatically.

**Example:**

```
GET /api/events/clicks/heatmap?page_url=https%3A%2F%2Fyoursite.com%2Fdashboard
```

**Response:**

```json
{
  "success": true,
  "data": [
    { "x": 420, "y": 315, "count": 12 },
    { "x": 100, "y": 200, "count": 8 },
    { "x": 550, "y": 400, "count": 5 }
  ]
}
```

---

## Project Structure

```
userAnalytics/
├── server.js              # Application entrypoint
├── app.js                 # Express app configuration
├── controller/
│   └── eventController.js # Request handlers
├── routes/
│   └── eventRoute.js      # Route definitions
├── model/
│   └── eventSchema.js     # Mongoose schema
├── middlewares/
│   └── validateEvent.js   # Request validation middleware
├── validators/
│   └── eventValidator.js  # Zod validation schemas
├── DB/
│   └── connectDb.js       # MongoDB connection helper
├── package.json
└── README.md
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes and open a PR

Please follow the existing code style and add tests where appropriate.
