A simple and efficient Inventory Management System built using the MERN Stack (MongoDB, Express, React, Node.js).
This project allows users to manage products, track stock levels, update items, and view dashboards.

Tech Stack

Frontend
React.js
Axios
Material UI / Bootstrap (if used)

Backend
Node.js
Express.js
MongoDB (Mongoose)

Database
MongoDB Atlas / Local MongoDB

Features

Add new inventory items
Update item details
Delete items
View all inventory
Search & filter items
Low-stock alerts
Dashboard with item count

Project Structure

/client  → React frontend
/server  → Node.js backend

Setup Instructions
1️ Clone the Repository
git clone <https://github.com/Ashes023/Inventory-Management-Mern-Project.git>
cd Inventory-Management-Mern-Project

2 Install Dependencies
Frontend:
cd client
npm install
npm start

Backend:
cd ../server
npm install
npm start

API Endpoints (Backend)
Method	  Endpoint	     Description
GET 	  /api/items	    Get all items
POST  	/api/items	    Create item
PUT   	/api/items/:id	Update item
DELETE	/api/items/:id	Delete item

Screenshots

(https://github.com/user-attachments/assets/f56b1665-f283-4483-8faf-b764795f8266)
(https://github.com/user-attachments/assets/49a3cd02-2c98-4563-ae67-e64e2a3e1d92)
(https://github.com/user-attachments/assets/d1ebe00d-29f0-47ec-b50a-87293a3e1488)
(https://github.com/user-attachments/assets/1553c62f-9c10-4aee-8440-301765434747)
(https://github.com/user-attachments/assets/ce114d9e-ae93-44c2-9c5f-459a365af047)
(https://github.com/user-attachments/assets/f3f033df-54bb-4005-ab4d-9438ec3bfc90)
(https://github.com/user-attachments/assets/435ac954-d528-4281-b3ce-f316d6e8ac5e)
(https://github.com/user-attachments/assets/e612ea33-a803-413f-b2d2-535c3d145c64)

Assumptions

User is running Node.js 18+
MongoDB connection string is configured in .env

Author

Name: Taranum
Email: taranumaggarwal3@gmail.com











