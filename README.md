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





#CrisisLink Auth API (Port 5000): Postman Testing Guide
1️⃣ Register User (Phone Mandatory, Email Optional)

Endpoint:

POST http://localhost:5000/api/auth/register


Request Body Example (User with email):

{
  "name": "John Doe",
  "phone": "+9779811111111",
  "email": "john@example.com",
  "password": "Test@123",
  "role": "user"
}


Request Body Example (User without email):

{
  "name": "Jane Smith",
  "phone": "+9779811122222",
  "password": "Test@123",
  "role": "user"
}


Response Example:

{
  "msg": "Registration successful. OTP sent to phone and email.",
  "otp": "123456"  // For testing only
}

2️⃣ Register Rescuer (Phone + Location Mandatory)

Endpoint:

POST http://localhost:5000/api/auth/register


Request Body Example:

{
  "name": "Rescuer One",
  "phone": "+9779822222222",
  "email": "rescuer@example.com",
  "password": "Rescue@123",
  "role": "rescuer",
  "location": { "lat": 27.7172, "lng": 85.3240 }
}


Important: Location is mandatory for Rescuer.
If missing:

{
  "msg": "Location is required for rescuer"
}


Response Example:

{
  "msg": "Registration successful. OTP sent to phone and email.",
  "otp": "789012"
}

3️⃣ Verify OTP

Endpoint:

POST http://localhost:5000/api/auth/verify-otp


Request Body Example:

{
  "phone": "+9779811111111",
  "otp": "123456"
}


Response Example:

{
  "msg": "OTP verified successfully"
}

4️⃣ Login

Endpoint:

POST http://localhost:5000/api/auth/login


Request Body Example:

{
  "phone": "+9779811111111",
  "password": "Test@123"
}


Response Example:

{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+9779811111111",
    "role": "user",
    "location": null
  }
}

5️⃣ Forgot Password (Send OTP)

Endpoint:

POST http://localhost:5000/api/auth/forgot-password


Request Body Example:

{
  "phone": "+9779811111111"
}


Response Example:

{
  "msg": "Password reset OTP sent to phone and email (if available)",
  "otp": "654321"
}

6️⃣ Reset Password

Endpoint:

POST http://localhost:5000/api/auth/reset-password


Request Body Example:

{
  "phone": "+9779811111111",
  "otp": "654321",
  "newPassword": "NewPass@123"
}


Response Example:

{
  "msg": "Password reset successful"
}







Find nearby recurers:


http://localhost:5000/api/rescues/nearby


{
  "lat": 27.6937,
  "lng": 85.3140,
  "maxDistance": 3000
}
