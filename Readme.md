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
| ├── NotFoundPage.jsx
│ ├── CreateChannelPage.jsx
│ └── YourVideosPage.jsx
│
├── routes/
│ └── ProtectedRoute.jsx
│
├── index.css
└── App.jsx
```

## 📂 Backend Folder Structure

A scalable backend architecture for the MERN stack (MongoDB, Express, React, Node.js) with clear separation of concerns.

```plane
backend/
├── .env
├── package.json
├── package-lock.json
├── server.js
├── config/
│   └── dbConnector.js
├── middlewares/
│   ├── errorHandlers.js
│   └── verifyJWT.js
├── models/
│   ├── ChannelModel.js
│   ├── CommentModel.js
│   ├── UserModel.js
│   └── VideoModel.js
├── routes/
│   ├── channelManagementRoutes.js
│   ├── userAuthRoutes.js
│   ├── videoCommentsRoutes.js
│   └── videoLibraryRoutes.js
└── utils/
    └── responseHandler.js
```

---

## ⚙️ Project Setup

### **Prerequisites**
- Node.js >= 18
- npm or yarn package manager
- MongoDB instance (local or Atlas)
- Backend running (see backend README or instructions)

---

### **1️⃣ Clone Repository**

```bash
git clone https://github.com/alankritip/Youtube_Clone
cd Youtube_Clone
```


### **2️⃣ Install Dependencies**
```bash
npm install
```

This will install React, Tailwind CSS, and all other frontend dependencies.

---

### **3️⃣ Setup Environment Variables**
In the root of the frontend project, create a `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

Adjust URL to match your backend server.

---

### **4️⃣ Start Development Servers**
**Frontend:**
```
npm run dev
```

Frontend now runs at `http://localhost:5173`.

**Backend (separate project folder):**

```
npm run dev
```

Backend runs at `http://localhost:5000`.

---

## 🚀 Usage Guide

### **Register & Login**
- Click **Sign in** from the header.
- Switch to register mode for first-time users.
- Login to access protected features.

### **Create Channel**
- Once logged in, click the "Create" button in the header or "Create channel" in the sidebar.
- Enter a channel name.
- Submit — you’ll be redirected to your new channel page.

### **Upload Video**
- Go to your channel page.
- Click **➕ Add Video**.
- Fill in:
  - Title
  - Video URL (publicly accessible mp4 or YouTube embed)
  - Thumbnail URL (public image)
  - Description (optional)
  - Category
- Submit to upload.

### **Edit/Delete Video**
- On your channel page (or Your Videos page), each video has **Edit** and **Delete** buttons (owner‑only).
- Edit opens a pre‑populated form.

### **View Videos**
- Click any video card from Home, Category filtered view, Channel page, or Your Videos.
- Video player page will display video, title, channel info, description.

---

## 📊 Demo Video Data for Testing

During development, you can use these sample entries:

**Music**
```
Title: Lo-fi Beats to Study
Video URL: https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4
Thumbnail URL: https://picsum.photos/seed/lofi/1280/720
Description: Ambient lo-fi loop for focus and productivity.
Category: Music
```


---

## 🔒 Authentication Logic Summary
- JWT stored in `localStorage` as `token`.
- `AuthContext` provides `user`, `login`, `logout` globally.
- `axiosInstance` attaches `Authorization: Bearer <token>` for protected API calls.

---

## 💡 Tips
- Use Cloudinary, S3, or another CDN for hosting video and thumbnail assets during development.
- Ensure backend endpoints `.populate('channel', 'channelName')` so **Unknown Channel** never appears.
- Add at least 1 video per category to make the UI look realistic.

---

## 📜 License
MIT — free to use, modify, and distribute.

---

