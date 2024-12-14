import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';
import { API_BASE_URL } from '../config';

function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [allowGuestSuggestions, setAllowGuestSuggestions] = useState(true);
    
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

    useEffect(() => {
        try {
            fetch(`${API_BASE_URL}/profile`, {
                credentials: 'include',
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Profile fetch failed');
                }
                return response.json();
            }).then(userInfo => {
                setUserInfo(userInfo);
            }).catch(error => {
                console.error('Error fetching profile:', error);
            });
        }
        catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    const username = userInfo?.username;

    const role = userInfo?.role;
    const isAdmin = role?.includes('admin');
    const isModerator = role?.includes('moderator') || isAdmin;
    const isVip = role?.includes('vip') || isModerator;
    const isUser = role?.includes('user') || isVip;

    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';  
    }
    
    function logout() {
        fetch(`${API_BASE_URL}/logout`, {
            credentials: 'include',
            method: 'POST',
        }).then(() => {
            deleteCookie('token');
            setUserInfo(null);
            window.location.reload();
            console.log(userInfo);
        });
    }


    return (
        <header>
            <div className="about">
                <Link to="/" className='Header-h1'>Oneriler</Link>
            </div>
            <div className="links">

                {isUser && (
                <>
                    <Link to="/">Home</Link>
                    <Link to={`/profile/${username}`}>Profile</Link>

                    {(allowGuestSuggestions || isAdmin || isModerator) && (
                        <Link to="/submit">Oneri Gonder</Link>
                    )}
                    
                    {isAdmin && (
                        <>
                        <Link to="/admin">Admin</Link>
                        <Link to="/preview">Oneriler</Link>
                        </>
                    )}

                    <a onClick={logout} style={{ cursor: 'pointer' }}>Logout</a>
                </>
                )}

                {!isUser && (
                    <>
                    <Link to="/">Home</Link>
                    {allowGuestSuggestions && (
                        <Link to="/submit">Oneri Gonder</Link>
                    )}
                    <Link to="/login">Login</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;