import { useState } from 'react';

export default function CommentBox({ onSubmit }) {
  const [text, setText] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };
  return (
    <form onSubmit={submit} className="flex gap-2 my-4">
      <input
        className="flex-1 border rounded px-3 py-2"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="bg-gray-800 text-white px-4 py-2 rounded">Post</button>
    </form>
  );
}
