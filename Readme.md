# 🎬 YouTube Clone - MERN Stack

A full‑stack MERN (MongoDB, Express, React, Node.js) application that mimics key features of YouTube such as user authentication, channel creation, video upload, edit & delete, categories, and viewing videos.

---

## 📌 Features

### **🔐 Authentication**
- User registration and login with JWT.
- Authenticated routes protected on the frontend using `ProtectedRoute`.
- Persistent login (token stored in localStorage).

### **📺 Video Management**
- Upload videos with:
  - Title
  - Video URL (MP4 or embeddable YouTube link)
  - Thumbnail URL
  - Description
  - Category
- Edit details of uploaded videos.
- Delete videos (owner‑only).
- View count tracking.

### **👤 Channel Management**
- Create new channels (owner automatically set based on logged‑in user).
- View channel page showing:
  - Banner
  - Name
  - Description
  - List of videos uploaded to that channel.
- Owner‑only options to edit and delete videos from channel page.

### **🎨 UI Features**
- Responsive layout built with **Tailwind CSS**.
- Main Header with:
  - Logo
  - Search
  - Auth buttons
  - YouTube‑style "Create" button
- Side navigation (hamburger menu) with sections:
  - Home
  - Shorts
  - Subscriptions
  - Your Videos (owner‑only)
  - History
  - Watch later
  - Liked videos
  - Settings & Help
- Category filter chips for browsing by video category.
- "Your Videos" management page to list all videos uploaded by current user.

---

## 🛠 Tech Stack

**Frontend**
- React + Vite
- React Router DOM for routing
- Tailwind CSS for styling
- Axios for API calls

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- Multer / external video hosting URL handling
- CORS enabled for dev

---

## 📂 Folder Structure (Frontend)

```plane
src/
├── api/
│ └── axiosInstance.js
│
├── components/
│ ├── cards/
│ │ └── VideoPreviewCard.jsx
│ ├── channel/
│ │ └── CreateChannelModal.jsx
│ ├── layout/
│ │ ├── MainHeader.jsx
│ │ └── NavSidebar.jsx
│
├── context/
│ └── AuthContext.jsx
│
├── pages/
│ ├── HomePage.jsx
│ ├── AuthPage.jsx
│ ├── VideoPlayerPage.jsx
│ ├── ChannelPage.jsx
│ ├── CreateChannelPage.jsx
│ └── YourVideosPage.jsx
│
├── routes/
│ └── ProtectedRoute.jsx
│
├── index.css
└── App.jsx
```
