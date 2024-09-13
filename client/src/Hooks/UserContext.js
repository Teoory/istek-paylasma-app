import { useEffect, useState, createContext } from 'react';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3030/profile', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data && !data.message) {
            setUserInfo(data); // Valid user data
          } else {
            setUserInfo(null); // No token or invalid token
          }
        } else {
          setUserInfo(null); // Clear user info on error
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUserInfo(null); // Handle fetch failure
      }
    };
    getUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
