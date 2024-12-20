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

