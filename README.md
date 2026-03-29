#  Lead Management Portal

A full-stack **Lead Management Portal (CRM)** built using **React, Node.js, Express, and MongoDB**.
This application helps manage leads, assign agents, track status, and perform operations like import/export, filtering, and role-based access.

## Features

### Authentication & Authorization

* JWT-based authentication
* Role-based access:

  * Super Admin
  * Sub Admin
  * Support Agent

### User Roles

| Role          | Permissions                                                  |
| ------------- | ------------------------------------------------------------ |
| Super Admin   | Full access (create agents, assign leads, manage everything) |
| Sub Admin     | Assign leads to support agents                               |
| Support Agent | View & update assigned leads                                 |

---

### Lead Management

* Create, update, delete leads
* Add notes to leads
* Assign leads to agents
* Status tracking:

  * New
  * Contacted
  * Qualified
  * Lost
  * Won

---

### Search & Filter

* Search by:

  * Name
  * Email
  * Phone
* Filter by:

  * Status
  * Tags
  * Assigned Agent
  * Date

---

### Import / Export

* Import leads from Excel (.xlsx)
* Export leads to Excel

---

### Dashboard

* Total Leads
* Won Leads
* New Leads
* Lost Leads

---

## Tech Stack

### Frontend

* React.js
* Axios
* React Toastify
* XLSX (Excel import/export)
* File Saver

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Bcrypt (Password hashing)

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Shrikanttathe-hub/Lead-Management-Frontend.git (frontend)
git clone https://github.com/Shrikanttathe-hub/Lead-Management-Backend.git (Backend)
cd lead-management-portal
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
DB_URL=mongodb+srv://sptathe:Shrikant358@cluster0.47eryog.mongodb.net/Lead-Management-Portal?appName=Cluster0
SECRET_KEY=12@#$@!&*357125376@#$@#14523465ekdfiq6787&*!@*^*&#^@$!##123

Run backend:

```bash
npm start or npm run dev
```

---

### 3Frontend Setup

```bash
cd frontend
npm install
npm start or npm run dev
```

---

## API Endpoints

### Auth

* `POST /auth/login`

### Leads

* `POST /lead/create`
* `GET /lead/lead-list`
* `GET /lead/lead-single/:id`
* `PUT /lead/lead-single/:id`
* `DELETE /lead/lead-single/:id`

### Agents

* `POST /agent/create-support-agent`
* `GET /agent/get-support-agent`

---
