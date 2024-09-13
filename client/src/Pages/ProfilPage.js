import { useEffect, useState, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';


const ProfilPage = () => {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`http://localhost:3030/profile/${username}`)
            .then(response => response.json())
            .then(data => setUserProfile(data));
    }, [username]);

    if (!userInfo) {
        return <Navigate to="/" />;
    }

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    
    return (
        <div className='user-profile-page'>
            <div className="ProfilePageMain">
                <h1>Profil</h1>
                <div className="ProfileCard">
                    <div className="infoArea">
                        <div className={`username`}><span className='userInfo'>Username:</span> {userProfile.username}</div>
                        {/* <div className="email"><span className='userInfo'>Mail:</span> {userProfile.email}</div> */}
                        <div className={`role ${userInfo.role}`}>Role: {userProfile.role}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProfilPage