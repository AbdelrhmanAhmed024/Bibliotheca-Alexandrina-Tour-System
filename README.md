# Bibliotheca Alexandrina Tour Management System

A web-based platform developed using **Node.js**, **Express.js**, and **MongoDB** to manage and organize tours inside the Bibliotheca Alexandrina. This project is part of the **Summer 2025 IT Internship Program**.

---

## 🚀 Project Goal

To simplify the process of managing, scheduling, and booking tours at Bibliotheca Alexandrina through a role-based control panel that supports:

- Creating and scheduling tours
- Assigning and managing tour guides
- Registering clients and tracking bookings
- Collecting reviews and feedback on tours and guides

---

## 👥 User Roles

1. **Admin** – Full access and system control
2. **Staff** – Support team with limited permissions
3. **Lead** – Tour supervisor
4. **Tour Guide** – Assigned to conduct tours
5. **Client** – Visitors who book and attend tours

---

## 🧩 Main Entities

### 1. User

Holds user info and assigned role in the system.

### 2. Tour

Stores details about the tour: date, time, level, capacity, guide, and status.

### 3. Booking

Connects a client to a booked tour.

### 4. Review

Client feedback about a tour or a tour guide.

---

## 🛠️ Technologies Used

- **Node.js** – Server-side JavaScript runtime
- **Express.js** – Web framework for APIs
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM for schema management
- **JWT** – Authentication using JSON Web Tokens
- **bcrypt** – Password hashing

---

## 🛡️ Authentication & Permissions

The system uses **JWT-based authentication** and middleware for **role-based access control**, ensuring each user only accesses allowed features.

---

## 🔮 Future Enhancements

- Frontend UI (React or Next.js)
- Tour analytics & reporting
- Multilingual support
- Integration with ticketing system

---

## 👨‍💻 Developer

**Abdelrahman Ahmed**  
Intern – IT Sector  
Bibliotheca Alexandrina – Summer 2025

---

## 📬 Contact

For feedback or inquiries, feel free to contact the internship supervisor or the project developer.
