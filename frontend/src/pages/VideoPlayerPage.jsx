/**
 * @file VideoPlayerPage.jsx
 * @description Plays selected video, shows title, likes/dislikes, and comments with CRUD.
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainHeader from '../components/layouts/MainHeader.jsx';
import CommentBox from '../components/comments/CommentBox.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axiosInstance.js';

export default function VideoPlayerPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchVideo = async () => {
    const { data } = await api.get(`/videos/${id}`);
    setVideo(data);
    await api.post(`/videos/${id}/view`).catch(() => {});
  };

  const fetchComments = async () => {
    const { data } = await api.get(`/comments/video/${id}`);
    setComments(data);
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  const likeVideo = async () => {
    if (!user) return alert("Sign in required");
    const { data } = await api.post(`/videos/${id}/like`);
    setVideo(v => ({ ...v, likes: data.likes, dislikes: data.dislikes }));
  };

  const dislikeVideo = async () => {
    if (!user) return alert("Sign in required");
    const { data } = await api.post(`/videos/${id}/dislike`);
    setVideo(v => ({ ...v, likes: data.likes, dislikes: data.dislikes }));
  };

  const addComment = async (text) => {
    if (!user) return alert("Sign in required");
    const { data } = await api.post(`/comments/video/${id}`, { text });
    setComments([data, ...comments]);
  };

  const editComment = async (cid, text) => {
    await api.patch(`/comments/${cid}`, { text });
    setComments(comments.map(c => c._id === cid ? { ...c, text } : c));
  };

  const deleteComment = async (cid) => {
    await api.delete(`/comments/${cid}`);
    setComments(comments.filter(c => c._id !== cid));
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div>
      <MainHeader />
      <div className="max-w-5xl mx-auto p-4">
        <div className="aspect-video mb-4">
          <iframe
            src={video.videoUrl}
            className="w-full h-full"
            allowFullScreen
            title={video.title}
          ></iframe>
        </div>
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <div className="flex gap-4 my-2">
          <button onClick={likeVideo} className="border px-3 py-1 rounded">👍 {video.likes?.length || 0}</button>
          <button onClick={dislikeVideo} className="border px-3 py-1 rounded">👎 {video.dislikes?.length || 0}</button>
        </div>
        <p className="mb-4">{video.description}</p>

        <h2 className="font-semibold mb-2">Comments</h2>
        <CommentBox onSubmit={addComment} />
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="border p-3 rounded">
              <div className="text-sm font-bold">{c.user.username}</div>
              <div>{c.text}</div>
              {user && user.id === c.user._id && (
                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                  <button onClick={() => {
                    const newText = prompt("Edit your comment:", c.text);
                    if (newText) editComment(c._id, newText);
                  }}>Edit</button>
                  <button onClick={() => deleteComment(c._id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
