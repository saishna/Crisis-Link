# Crisis-Link

The Disaster Alert System is a comprehensive mobile and web application developed to provide real-time alerts and notifications for disaster-prone areas, with a primary focus on flood management in the Teku area of Kathmandu. The system aims to assist in early detection, efficient communication, and prompt evacuation to reduce the impact of disasters.

---

## Steps to Start the Server
1. Open the terminal.
2. Run the following command to start the server:
   ```bash
   node server.js
   ```

---

## Postman Testing for `helpline.js`

### **Emergency CRUD Operations**

#### **Create Emergency**
- **Endpoint**: `http://localhost:5000/api/emergency`
- **Method**: POST
- **Request Body**:
  ```json
  {
      "name": "Medical Helpline",
      "latitude": 27.7123,
      "longitude": 85.3223,
      "number": "9876543210",
      "email": "help@example.com",
      "address": "Hospital Road"
  }
  ```

#### **Get All Emergencies**
- **Endpoint**: `http://localhost:5000/api/emergency`
- **Method**: GET

#### **Get Emergency by ID**
- **Endpoint**: `http://localhost:5000/api/emergency/:id`
- **Method**: GET
- Replace `:id` with the Emergency ID.

#### **Update Emergency**
- **Endpoint**: `http://localhost:5000/api/emergency/:id`
- **Method**: PUT
- **Request Body**:
  ```json
  {
      "name": "Updated Medical Helpline",
      "latitude": 27.7133,
      "longitude": 85.3233,
      "number": "9999999999",
      "email": "help-updated@example.com",
      "address": "Updated Hospital Road"
  }
  ```
- Replace `:id` with the Emergency ID.

#### **Delete Emergency**
- **Endpoint**: `http://localhost:5000/api/emergency/:id`
- **Method**: DELETE
- Replace `:id` with the Emergency ID.

---

### **Helpline CRUD Operations**

#### **Create Helpline**
- **Endpoint**: `http://localhost:5000/api/helpline`
- **Method**: POST
- **Request Body**:
  ```json
  {
      "name": "General Helpline",
      "latitude": 27.7133,
      "longitude": 85.3233,
      "number": "1234567890",
      "email": "general@example.com",
      "address": "Main Street"
  }
  ```

#### **Get All Helplines**
- **Endpoint**: `http://localhost:5000/api/helpline`
- **Method**: GET

#### **Get Helpline by ID**
- **Endpoint**: `http://localhost:5000/api/helpline/:id`
- **Method**: GET
- Replace `:id` with the Helpline ID.

#### **Update Helpline**
- **Endpoint**: `http://localhost:5000/api/helpline/:id`
- **Method**: PUT
- **Request Body**:
  ```json
  {
      "name": "Updated General Helpline",
      "latitude": 27.7144,
      "longitude": 85.3244,
      "number": "9876543210",
      "email": "updated@example.com",
      "address": "Updated Street"
  }
  ```
- Replace `:id` with the Helpline ID.

#### **Delete Helpline**
- **Endpoint**: `http://localhost:5000/api/helpline/:id`
- **Method**: DELETE
- Replace `:id` with the Helpline ID.

---

## Postman Testing for `flood.js`

### **Flood Zones CRUD Operations**

#### **Create Flood Zone**
- **Endpoint**: `http://localhost:5000/api/flood-zones`
- **Method**: POST
- **Request Body**:
  ```json
  {
  "name": "Teku Area",
  "location": {
    "coordinates": [27.6939, 85.3214],
    "address": "Teku, Kathmandu"
  },
  "riskLevel": "High",
  "description": "Flood risk due to heavy rains in the monsoon season.",
  "resolved": false
 }
  ```

#### **Get All Flood Zones**
- **Endpoint**: `http://localhost:5000/api/flood-zones`
- **Method**: GET

#### **Get Flood Zone by ID**
- **Endpoint**: `http://localhost:5000/api/flood-zones/:id`
- **Method**: GET
- Replace `:id` with the Flood Zone ID.

#### **Update Flood Zone**
- **Endpoint**: `http://localhost:5000/api/flood-zones/:id`
- **Method**: PUT
- **Request Body**:
  ```json
  {
      "name": "Updated Teku Area",
      "location": {
          "coordinates": [27.6940, 85.3220],
          "address": "Updated Teku, Kathmandu"
      },
      "riskLevel": "Moderate",
      "resolved": true
  }
  ```
- Replace `:id` with the Flood Zone ID.

#### **Delete Flood Zone**
- **Endpoint**: `http://localhost:5000/api/flood-zones/:id`
- **Method**: DELETE
- Replace `:id` with the Flood Zone ID.

## Postman Testing for `rescue.js`

### **Rescue Request CRUD Operations**

#### **Create Rescue Request**
- **Method:** `POST`
- **Endpoint:** `/api/rescues`
- **Description:** Create a new rescue request.

##### Request Body (JSON)
```json
{
  "name": "John Doe",
  "risk": "High",
  "status": "Active",
  "location": {
    "address": "123 River Street",
    "coordinates": {
      "lat": 27.700769,
      "lng": 85.300140
    }
  },
  "action": "Unresolved"
}


Get All Rescue Requests
Method: GET

Endpoint: /api/rescues

Description: Retrieves a list of all rescue requests.

Get a Single Rescue Request
Method: GET

Endpoint: /api/rescues/:id

Description: Fetches a single rescue request by its ID.

Update a Rescue Request
Method: PUT

Endpoint: /api/rescues/:id

Description: Updates the rescue request identified by the given ID.

Example Request Body
json
Copy
Edit
{
  "status": "Closed",
  "action": "Resolved"
}
Delete a Rescue Request
Method: DELETE

Endpoint: /api/rescues/:id

Description: Deletes the rescue request by ID.

Sample Response
json
Copy
Edit
{
  "message": "Rescue deleted successfully"
}


# Request Approval API 📚

This API provides endpoints to create, retrieve, update, delete, approve, and reject requests.

## API Endpoints

| Method | Endpoint | Description |
|:------:|:--------:|:----------- |
| **POST** | `/api/requests/` | Create a new request |
| **GET** | `/api/requests/` | Get all requests |
| **GET** | `/api/requests/:id` | Get a specific request by ID |
| **PUT** | `/api/requests/:id` | Update a request by ID |
| **DELETE** | `/api/requests/:id` | Delete a request by ID |
| **PATCH** | `/api/requests/approve/:id` | Approve a request |
| **PATCH** | `/api/requests/reject/:id` | Reject a request |

---

## Request Body Example (Create)

When creating a new request, send the following JSON structure:

```json
{
  "name": "Flood Zone Area A",
  "location": {
    "coordinates": [34.0522, -118.2437],
    "address": "123 Main St, Los Angeles, CA"
  },
  "riskLevel": "High",
  "description": "Evidence of frequent flooding in the area.",
  "proof": "https://example.com/proof-image.jpg",
  "initiator": "604c1f7f5311230015e6b8b1"
}





###login 


Postman Testing for auth.js
📝 POSTMAN TEST — Register User
➡ Endpoint
POST http://localhost:5000/api/auth/register

➡ Headers
Content-Type: application/json

1️⃣ Register Normal User
Request Body
{
  "name": "Saishna",
  "email": "saishna@example.com",
  "password": "password123",
  "role": "user"
}

Expected Response
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "<USER_ID>",
    "name": "Saishna",
    "email": "saishna@example.com",
    "role": "user"
  }
}


Notes:

Checks if the user already exists.

Hashes the password using bcrypt.

Returns JWT token and user info.

Login User

Endpoint: POST http://localhost:5000/api/auth/login

Headers: Content-Type: application/json

Request Body:

{
  "email": "saishna@example.com",
  "password": "password123"
}


Response:

{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "<USER_ID>",
    "name": "Saishna",
    "email": "saishna@example.com",
    "role": "user"
  }
}


Notes:

Validates user credentials.

Returns JWT if credentials are correct.

Forgot Password

Endpoint: POST http://localhost:5000/api/auth/forgot-password

Headers: Content-Type: application/json

Request Body:

{
  "email": "saishna@example.com"
}


Response (for testing):

{
  "msg": "Reset token generated",
  "resetToken": "<RESET_TOKEN>"
}


Notes:

Generates a random token valid for 15 minutes.

Saves the token in the database.

In production, this token would be emailed to the user.

Reset Password

Endpoint: POST http://localhost:5000/api/auth/reset-password

Headers: Content-Type: application/json

Request Body:

{
  "token": "<PASTE_RESET_TOKEN_HERE>",
  "newPassword": "newpassword123"
}


Response:

{
  "msg": "Password successfully reset"
}


Notes:

Finds user by reset token and checks expiry.

Hashes the new password.

Clears the reset token and expiry from user record.

Testing Tips with Postman

Start the server: node server.js.

Test endpoints in the following order:

Register User

Login User

Forgot Password → copy resetToken

Reset Password → use copied token

Optional: Automate token using environment variables:

Create environment variable: resetToken.

In Forgot Password → Tests tab:

pm.environment.set("resetToken", pm.response.json().resetToken);


In Reset Password body:

{
  "token": "{{resetToken}}",
  "newPassword": "newpassword123"
}


✅ No need to copy-paste token manually.

Notes

Use .env for secrets (MONGO_URI, JWT_SECRET).

JWT token expires in 1 day.

Optional: use express.json() instead of body-parser.




