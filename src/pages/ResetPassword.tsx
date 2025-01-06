import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';

export default function ResetPassword(props: { disableCustomTheme?: boolean }) {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const resetCode = searchParams.get('key');
    const navigate = useNavigate();

    useEffect(() => {
        if (resetCode) {
            axios.get(`https://final-nest-back.vercel.app/user/verifyResetCode?key=${resetCode}`)
                .then(response => setEmail(response.data.email))
                .catch(() => setError('Invalid or expired reset code.'));
        }
    }, [resetCode]);

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://final-nest-back.vercel.app/user/resetPassword', {
                email,
                newPassword,
                resetCode,
            });

            if (response.data.success) {
                setSuccess('Password reset successful, redirect to login page...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError('Failed to reset password. Please try again.');
                setLoading(false);
            }
        } catch {
            setError('An error occurred. Please try again.');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <Box sx={{ maxWidth: 400, mx: 'auto', mt: 28, mb: 28 }}>
                    <Typography variant="h5" sx={{ textAlign: 'center' }}>Reset Password</Typography>
                    {email && <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>For {email}</Typography>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        InputLabelProps={{
                            sx: {
                                transform: 'translate(0, -15px) scale(0.75)',
                            },
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputLabelProps={{
                            sx: {
                                transform: 'translate(0, -15px) scale(0.75)',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!newPassword || !confirmPassword || loading}
                        sx={{
                            mt: 2,
                            '&.Mui-disabled': {
                                bgcolor: 'grey.300',
                                color: 'grey.300',
                            },
                        }}
                    >
                        {(loading) ? 'Loading...' : 'Reset Password'}
                    </Button>
                </Box>
            </AppTheme>
        </>
    );
}