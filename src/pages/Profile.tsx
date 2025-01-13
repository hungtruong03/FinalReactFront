import React, { useEffect, useState } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const Home: React.FC = () => {
    const [userData, setUserData] = useState<{ email: string; username: string; isGoogleAccount: boolean } | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const getAccessToken = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        setAccessToken(getAccessToken);
    }, [getAccessToken]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (accessToken) {
                try {
                    const response = await axios.get('https://final-nest-back.vercel.app/user/profile', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };

        fetchUserProfile();
    }, [accessToken]);

    return (
        <div className="bg-[url('https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-may-tinh-dep-a-41-1.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col text-white">
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
                    {userData ? (
                        <div className="text-lg">
                            <p>
                                <span className="font-semibold">Username:</span> {userData.username}
                            </p>
                            <p>
                                <span className="font-semibold">Email:</span> {userData.email}
                            </p>
                            {userData.isGoogleAccount && (
                                <p>
                                    <span className="font-semibold">(Google Account)</span>
                                </p>
                            )}
                        </div>
                    ) : (
                        <CircularProgress />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;