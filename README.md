# TokenizationBackend
This is the backend for tokenization backend portal





🔐 Authentication & Authorization

This backend uses JWT-based authentication and role-based authorization with three user types:

BUYER

SELLER

ADMIN

Passwords are hashed using bcryptjs and users authenticate using tokens stored in the Authorization header.

📌 Overview

Auth stack:

Login & registration using JWT

Password hashing with bcryptjs

Roles: BUYER, SELLER, ADMIN

Access control through authGuard and requireRole

Protected routes reject unauthorized/invalid tokens

Logged-in user details available through /auth/me and /users/me

Base URL (dev):

http://localhost:8080/api/v1

🧑‍💻 User Model
User {
  _id: string
  name: string
  email: string
  role: "BUYER" | "SELLER" | "ADMIN"
  createdAt: string
  updatedAt: string
}


Password is excluded from responses.

🔑 JWT Authentication

The backend expects the JWT token in the request header:

Authorization: Bearer <jwt-token>


When valid, backend attaches the authenticated user to:

req.user = {
  id,
  email,
  name,
  role
};

📍 Auth Endpoints
1. Register

POST /auth/register

Registers a new user and returns a token.

Request body:

{
  "name": "Tashi",
  "email": "tashi@example.com",
  "password": "secret123",
  "role": "BUYER"
}


Response:

{
  "success": true,
  "data": { "_id": "...", "name": "Tashi", "email": "tashi@example.com", "role": "BUYER" },
  "token": "<jwt>"
}

2. Login

POST /auth/login

Request body:

{
  "email": "tashi@example.com",
  "password": "secret123"
}


Response:

{
  "success": true,
  "data": { "_id": "...", "name": "Tashi", "email": "tashi@example.com", "role": "BUYER" },
  "token": "<jwt>"
}

3. Get Current User (Auth-based)

GET /auth/me
Requires JWT

Returns basic authenticated user info from the token.

Response:

{
  "success": true,
  "data": { "id": "...", "email": "tashi@example.com", "name": "Tashi", "role": "BUYER" }
}

4. Get Current User (DB-based)

GET /users/me
Requires JWT

Returns complete user profile from database.

Response:

{
  "success": true,
  "data": { "_id": "...", "name": "Tashi", "email": "tashi@example.com", "role": "BUYER" }
}

👮 Role-Based Authorization

Middleware:

authGuard – verifies JWT

requireRole("ADMIN") – blocks non-admins

requireRole("SELLER") – allows sellers only

requireRole("BUYER", "SELLER") – allows multiple roles

Roles supported:

"BUYER" | "SELLER" | "ADMIN"


Any route can apply role restrictions.

Example:

router.get("/admin-dashboard",
  authGuard,
  requireRole("ADMIN"),
  controller.adminPage
);

👤 User Management (Admin Only)

All /users routes (except /users/me) require:

Authorization: Bearer <admin-jwt>


And backend checks:

requireRole("ADMIN")

5. Create User (Admin)

POST /users

{
  "name": "Seller One",
  "email": "seller@example.com",
  "password": "secret123",
  "role": "SELLER"
}

6. Get All Users (Admin)

GET /users

Returns an array of users without passwords.

7. Get User by ID (Admin)

GET /users/:id

8. Update User (Admin)

PUT /users/:id

Allowed fields:

{
  "name": "Updated Name",
  "email": "new@example.com",
  "role": "BUYER"
}

9. Delete User (Admin)

DELETE /users/:id

Deletes the user.

🔐 Tokenized Asset Routes (Protected)

All /tokens routes require JWT (any role).

List tokens

GET /tokens

Create tokenized asset

POST /tokens

These will later integrate with blockchain minting logic.

⚠️ Error Response Format

Most backend errors follow:

{
  "success": false,
  "message": "Error message here"
}


Examples:

400: Validation failed

401: Missing/invalid token

403: Insufficient role

404: Not found

500: Server error


✅ 1. REGISTER USER

POST /api/v1/auth/register

Request Body (JSON)
{
  "name": "User Name",
  "email": "example@mail.com",
  "password": "password123",
  "role": "BUYER"        // BUYER | SELLER | ADMIN (optional; default BUYER)
}

Response

data → user object

token → JWT (save this)

✅ 2. LOGIN USER

POST /api/v1/auth/login

Request Body
{
  "email": "example@mail.com",
  "password": "password123"
}

Response

data → user object

token → JWT (save this)

❗ REQUIRED FOR ALL PROTECTED ROUTES

Every protected request must include:

Headers
Authorization: Bearer <JWT_TOKEN>

✅ 3. GET CURRENT USER (AUTH TOKEN BASED)

GET /api/v1/auth/me

Headers
Authorization: Bearer <token>

Response

current user info (from token)

✅ 4. GET CURRENT USER FROM DATABASE

GET /api/v1/users/me

Headers
Authorization: Bearer <token>

Response

full user profile loaded from DB

👮 ADMIN-ONLY ROUTES

You MUST be logged in as role: "ADMIN".

✅ 5. CREATE USER (ADMIN)

POST /api/v1/users

Headers
Authorization: Bearer <admin-token>

Body
{
  "name": "New User",
  "email": "new@mail.com",
  "password": "password123",
  "role": "SELLER"
}

✅ 6. GET ALL USERS (ADMIN)

GET /api/v1/users

Headers
Authorization: Bearer <admin-token>

✅ 7. GET USER BY ID (ADMIN)

GET /api/v1/users/:id

Headers
Authorization: Bearer <admin-token>

✅ 8. UPDATE USER (ADMIN)

PUT /api/v1/users/:id

Headers
Authorization: Bearer <admin-token>

Body (optional fields)
{
  "name": "Updated Name",
  "email": "updated@mail.com",
  "role": "BUYER"
}

✅ 9. DELETE USER (ADMIN)

DELETE /api/v1/users/:id

Headers
Authorization: Bearer <admin-token>