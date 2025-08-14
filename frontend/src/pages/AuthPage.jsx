import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
  e.preventDefault();
  try {
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password
    };
    const { data } = await api.post(endpoint, payload);
    login(data);
    navigate('/');
  } catch (err) {
    alert(
      err?.response?.data?.errors
        ?.map(er => `${er.field || er.path}: ${er.msg}`)
        .join('\n') || 'Error'
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">
          {mode === 'login' ? 'Sign In' : 'Register'}
        </h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <button className="w-full bg-red-600 text-white py-2 rounded">
            {mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-sm">
          {mode === 'login' ? (
            <span>New? <button className="underline" onClick={() => setMode('register')}>Create account</button></span>
          ) : (
            <span>Have an account? <button className="underline" onClick={() => setMode('login')}>Sign in</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
