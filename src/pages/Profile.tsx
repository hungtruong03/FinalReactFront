import React, { useEffect, useState } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Home: React.FC = () => {
    const [userData, setUserData] = useState<{ email: string; username: string; isGoogleAccount: boolean; image?: string; } | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'error' | 'info' | 'success' | 'warning' }>({ open: false, message: '', severity: 'info' });
    const { open, message, severity } = snackbar;

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

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

    const handleEditAvatar = () => {
        setIsImageModalOpen(true);
    };

    const handleCancelAvatar = () => {
        setIsImageModalOpen(false);
        setNewImageUrl('');
    };

    const handleUpdateAvatar = async () => {
        if (accessToken && newImageUrl.trim() !== '') {
            try {
                await axios.post(
                    'https://final-nest-back.vercel.app/user/updateAvatar',
                    { imageUrl: newImageUrl },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setUserData((prevData) => prevData && { ...prevData, image: newImageUrl });
                setIsImageModalOpen(false);
                setNewImageUrl('');
                setSnackbar({
                    open: true,
                    message: 'Avatar updated successfully.',
                    severity: 'success',
                });
            } catch (error) {
                console.error('Error updating avatar:', error);
                setSnackbar({
                    open: true,
                    message: 'Error updating avatar.',
                    severity: 'error',
                });
            }
        }
    };

    const handleChangePassword = () => {
        setIsPasswordModalOpen(true);
    };

    const handleCancelPassword = () => {
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
    };

    const handleUpdatePassword = async () => {
        if (accessToken && currentPassword.trim() !== '' && newPassword.trim() !== '') {
            try {
                await axios.post(
                    'https://final-nest-back.vercel.app/user/changePassword',
                    { oldPassword: currentPassword, newPassword },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setIsPasswordModalOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setSnackbar({
                    open: true,
                    message: 'Password updated successfully.',
                    severity: 'success',
                });
            } catch (error) {
                console.error('Error changing password:', error);
                setSnackbar({
                    open: true,
                    message: 'Error changing password.',
                    severity: 'error',
                });
            }
        }
    };

    return (
        <div className="bg-[url('https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-may-tinh-dep-a-41-1.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col text-white">
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
                    {userData ? (
                        <div className="text-lg">
                            {!userData.isGoogleAccount && (
                                <div className="flex justify-center items-center">
                                    <img
                                        src={userData.image || `https://i.pinimg.com/736x/0b/8e/41/0b8e410aa05816bfda615c2a6717ed9f.jpg`}
                                        alt="Avatar"
                                        className="rounded-full mb-4 shadow-lg"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
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
                            {!userData.isGoogleAccount && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="mt-4"
                                        onClick={handleEditAvatar}
                                        sx={{
                                            backgroundColor: 'blue',
                                            color: '#fff',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#1e40af',
                                            },
                                        }}
                                    >
                                        Edit Avatar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mt-4 ml-4"
                                        onClick={handleChangePassword}
                                        sx={{
                                            backgroundColor: '#6b21a8',
                                            color: '#fff',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#9d4f96',
                                            },
                                        }}
                                    >
                                        Change Password
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : (
                        <CircularProgress />
                    )}
                </div>
            </div>
            {/* Modal for Editing Avatar */}
            <Modal open={isImageModalOpen} onClose={handleCancelAvatar}>
                <div className="bg-white p-6 rounded-lg shadow-lg mx-auto mt-24 w-96">
                    <h2 className="text-xl font-bold mb-4">Edit Avatar</h2>
                    <TextField
                        label="Avatar URL"
                        variant="outlined"
                        fullWidth
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="mb-4"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelAvatar}
                            sx={{
                                borderColor: '#00bcd4',
                                color: '#00bcd4',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#008c8c',
                                    color: '#008c8c',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateAvatar}
                            sx={{
                                backgroundColor: '#ff9800',
                                color: '#fff',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#f57c00',
                                },
                            }}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal for Changing Password */}
            <Modal open={isPasswordModalOpen} onClose={handleCancelPassword}>
                <div className="bg-white p-6 rounded-lg shadow-lg mx-auto mt-24 w-96">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <TextField
                        label="Current Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mb-4"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mb-4"
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelPassword}
                            sx={{
                                borderColor: '#00bcd4',
                                color: '#00bcd4',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#008c8c',
                                    color: '#008c8c',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdatePassword}
                            sx={{
                                backgroundColor: '#ff9800',
                                color: '#fff',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#f57c00',
                                },
                            }}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Modal>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Home;