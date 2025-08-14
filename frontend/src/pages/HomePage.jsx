/**
 * @file HomePage.jsx
 * @description Displays video grid with category filter, search, and responsive layout.
 */

import { useState, useEffect } from 'react';
import MainHeader from '../components/layout/MainHeader.jsx';
import NavSidebar from '../components/layout/NavSidebar.jsx';
import CategoryFilters from '../components/filters/CategoryFilters.jsx';
import VideoPreviewCard from '../components/cards/VideoPreviewCard.jsx';
import api from '../api/axiosInstance.js';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos', {
        params: { q: searchQuery, category },
      });
      setVideos(data.videos);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader onSearch={setSearchQuery} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <NavSidebar open={sidebarOpen} />
        <main className="flex-1">
          <CategoryFilters selected={category} onChange={setCategory} />
          <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((v) => (
              <VideoPreviewCard key={v._id} v={v} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
