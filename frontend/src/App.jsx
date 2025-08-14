/**
 * @file App.jsx
 * @description App routing configuration with YourVideosPage route added.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';

import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import VideoPlayerPage from './pages/VideoPlayerPage.jsx';
import ChannelPage from './pages/ChannelPage.jsx';
import CreateChannelPage from './pages/CreateChannelPage.jsx';
import YourVideosPage from './pages/YourVideosPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/video/:id" element={<VideoPlayerPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/channel/create" element={<CreateChannelPage />} />
            <Route path="/me/videos" element={<YourVideosPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
