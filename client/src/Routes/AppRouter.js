import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { Routes, Route } from 'react-router-dom';
import { API_BASE_URL } from '../config';

import Home from '../Pages/Home';

import Login from '../Pages/Login';
import Register from '../Pages/RegisterPage';
import ProfilPage from '../Pages/ProfilPage';

import SuggestionForm from '../Pages/SuggestionForm';
import PreviewPage from '../Pages/PreviewPage';
import AdminPage from '../Pages/AdminPage';


const AppRouter = () => {
  const { userInfo } = useContext(UserContext);
  const [allowGuestSuggestions, setAllowGuestSuggestions] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        credentials: 'include',
      });
      const data = await response.json();
      setAllowGuestSuggestions(data.allowGuestSuggestions);
    };
    fetchSettings();
  }, []);
  
  const role = userInfo?.role;
  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator';

  return (
    <Routes>
        <Route path="/*" element={<Home />} />

        {(allowGuestSuggestions || isAdmin || isModerator) && (
          <Route path="/submit" element={<SuggestionForm />} />
        )}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {userInfo && (
        <Route path="/profile/:username" element={<ProfilPage />} />
        )}

        {isAdmin && (
          <>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/preview" element={<PreviewPage />} />
          </>
        )}
        
    </Routes>
  )
}

export default AppRouter