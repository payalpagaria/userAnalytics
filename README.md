# User Analytics Service

A simple backend service to capture and analyze user interaction events such as **page views** and **clicks**.
The system stores session-based events and provides basic analytics APIs using MongoDB aggregations.

---

## Tech Stack

* **Node.js** – Runtime environment
* **Express.js** – Web framework
* **MongoDB** – Database
* **Mongoose** – ODM for MongoDB
* **Zod** – Request validation

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/payalpagaria/userAnalytics.git
cd userAnalytics
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

> An `.env.example` file is provided for reference.

---

### 4. Start the server

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

---

## API Endpoints

### Create an Event

```http
POST /api/events
```

**Example payload (page view):**

```json
{
  "session_id": "sess_123",
  "event_type": "page_view",
  "page_url": "/home"
}
```

**Example payload (click):**

```json
{
  "session_id": "sess_123",
  "event_type": "click",
  "page_url": "/pricing",
  "click_coordinates": {
    "x": 420,
    "y": 315
  }
}
```

---

### Fetch Sessions with Event Counts

```http
GET /api/events/sessions
```

**Response:**

```json
[
  {
    "session_id": "sess_123",
    "eventCount": 5
  }
]
```


