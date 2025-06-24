# Gearment Fullstack Homework

A take-home assignment for evaluating fullstack engineers with a focus on relational database design, REST API development, and responsive UI implementation using **ReactJS**.

## 📘 Objective

Design and implement a simple **Leave Management System** where employees can request leave and managers can approve/reject them.

## 📌 Basic Requirements (For All Candidates)

> These are required for **Junior**, **Mid**, and **Senior** candidates.

### 🗄️ Backend
- [ ] `POST /login` with mock or hardcoded login (employee vs. manager)
- [ ] `POST /leave-request`: Submit a new leave request
- [ ] `GET /leave-request`: View your own leave requests
- [ ] `PATCH /leave-request/:id`: Approve/reject (manager only)
- [ ] `GET /leave-balance`: Show available leave days
- [ ] Design relational schema with:
  - [ ] `users` table
  - [ ] `leave_requests` table
  - [ ] `leave_balances` table

### 💻 Frontend (React)
- [ ] Login switch for user role (employee/manager)
- [ ] Dashboard:
  - [ ] Display leave balance
  - [ ] Table of previous leave requests
- [ ] Form to submit leave request
- [ ] Manager view to approve/reject requests
- [ ] Responsive layout using Bootstrap

## 🟢 Junior-Level – Optional Extras

> These are **optional**, but will help you stand out.

- [ ] Basic frontend form validation (e.g. required fields, valid dates)
- [ ] Filter or sort leave requests table by status or date
- [ ] Use reusable React components (`FormGroup`, `TableRow`, etc.)
- [ ] Meaningful commit history and README

## 🟡 Mid-Level – Additional Requirements

> If you’re applying for a **Mid-Level** position, you are expected to complete **some** of the following.

- [ ] Add support for **leave types** (annual, sick, unpaid)
- [ ] Block **overlapping leave requests**
- [ ] Backend folder structure: `handlers/`, `services/`, `repos/`
- [ ] Frontend folder structure: `components/`, `pages/`, `services/`
- [ ] 1–2 backend **unit tests** for key logic
- [ ] Include **Dockerfile** or `docker-compose.yml` to run fullstack

## 🔴 Senior-Level – Advanced Requirements

> If you’re applying for a **Senior** role, you are expected to complete several of the following.

- [ ] Apply **Clean Architecture** or layered design to backend
- [ ] Middleware for **Role-Based Access Control (RBAC)**
- [ ] 4–5 **unit/integration tests** (e.g. for approval, validation, access control)
- [ ] GitHub Actions (or CI pipeline) for test/lint/build
- [ ] Add `/docs/decisions.md` with 3–5 architecture or design decisions
- [ ] Generate **OpenAPI (Swagger)** spec for API docs
- [ ] Use **React Context API** or simple state management for leave state
- [ ] Handle UI edge cases (e.g. error boundaries, toast feedback)

## 📎 Tip

- You’re not expected to finish **everything**.
- Prioritize clarity, structure, and engineering maturity over flashy features.
- Bonus items are a chance to go deeper based on your experience level.

Good luck!

## 📦 Folder Structure

```sh
fullstack-homework/
├── frontend/           # React + Bootstrap
├── backend/            # REST API
├── database/           # SQL schema / migrations
├── README.md           # This file
└── docker-compose.yml  # (Optional for fullstack setup)
```

## 🕐 Estimated Time

Working days: 7 days, bonus points come with the earlier submission

## ✅ Submission Guidelines

1. Fork this repository or upload to your GitHub
2. Include setup steps in a `README.md` inside each folder (`frontend/`, `backend/`)
3. Optionally deploy or record a demo video
4. Submit the repo link for review

## 📮 Questions?

If you have any questions or need clarifications, feel free to reach out to the hiring team at tech@gearment.com.

Good luck and have fun!
Save to Cacher