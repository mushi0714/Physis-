import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password
      });
      
      localStorage.setItem('physis_token', response.data.token);
      onLoginSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-physis-avena text-physis-avellana p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/70 backdrop-blur-lg border border-white rounded-[2.5rem] shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-widest uppercase">Physis</h2>
          <p className="text-sm font-medium opacity-60 mt-2">Welcome back to your center.</p>
        </div>

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physis-terracota transition-all placeholder-gray-400 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physis-terracota transition-all placeholder-gray-400 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* BOTÓN ESTÁNDAR PHYSIS */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-physis-terracota text-white font-bold rounded-xl shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;