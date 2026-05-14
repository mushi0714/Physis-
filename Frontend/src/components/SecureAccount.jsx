import React, { useState } from 'react';
import axios from 'axios';

const SecureAccount = ({ email, onComplete }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/users/secure-account', {
        email,
        password
      });
      onComplete(); 
    } catch (error) {
      alert("Error securing account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white/50 backdrop-blur-md border border-white rounded-3xl shadow-xl max-w-md mx-auto">
      <h3 className="text-xl font-bold text-physis-avellana mb-2 text-center leading-tight">Secure Your Path</h3>
      <p className="text-physis-avellana/60 text-sm mb-6 text-center font-medium">
        Create a password to save your progress: <br/><span className="text-physis-terracota font-bold">{email}</span>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physis-terracota transition-all placeholder-gray-400 font-medium text-physis-avellana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-physis-terracota text-white w-full py-4 rounded-xl font-bold shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Securing..." : "Secure Account"}
        </button>
      </form>
    </div>
  );
};

export default SecureAccount;