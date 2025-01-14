import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from './theme/AppTheme';
// import { GoogleIcon } from '../components/CustomIcons';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch } from "react-redux";
import { login } from '../store/authSlice';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function SignUp(props: { disableCustomTheme?: boolean }) {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);
    const [registrationPayload, setRegistrationPayload] = React.useState<{ username: FormDataEntryValue | null; email: FormDataEntryValue | null; password: FormDataEntryValue | null } | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'error' | 'info' | 'success' | 'warning' }>({ open: false, message: '', severity: 'info' });
    const { open, message, severity } = snackbar;

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
        const username = document.getElementById('username') as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (confirmPassword.value !== password.value) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        } else if (!confirmPassword.value || confirmPassword.value.length < 6) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        if (!username.value || username.value.length < 1) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required.');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        return isValid;
    };

    const handleRequestOTP = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);
        const payload = {
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
        };

        setLoading(true);

        try {
            const response = await axios.post('https://final-nest-back.vercel.app/user/requestOTP', {
                email: payload.email,
            });

            if (response.status === 200) {
                setRegistrationPayload(payload);
                setModalOpen(true);
            } else {
                throw new Error('Failed to request OTP.');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to send OTP. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOTP = async () => {
        if (!otp) {
            setSnackbar({
                open: true,
                message: 'Please enter the OTP.',
                severity: 'warning',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://final-nest-back.vercel.app/user/register', {
                ...registrationPayload,
                otp,
            });

            if (response.status === 200) {
                setSnackbar({
                    open: true,
                    message: 'Registration successful! Redirecting to login...',
                    severity: 'success',
                });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                throw new Error('Failed to register.');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Registration failed. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
            setModalOpen(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse): Promise<void> => {
        setLoading(true);

        try {
            if (!credentialResponse.credential) {
                setSnackbar({
                    open: true,
                    message: 'Credential is undefined',
                    severity: 'error',
                });
                setLoading(false);
                return;
            }

            const response = await axios.post('https://final-nest-back.vercel.app/user/logingg', {
                token: credentialResponse.credential,
            });

            const { accessToken, refreshToken } = response.data;

            // Dispatch tokens to Redux
            dispatch(
                login({
                    accessToken,
                    refreshToken,
                })
            );

            // Redirect user after successful login
            navigate('/');
        } catch (error: any) {
            console.error('Google login failed:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Google login failed.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setSnackbar({
            open: true,
            message: 'Google login was unsuccessful. Please try again.',
            severity: 'error',
        });
    };

    return (
        <>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
                <SignUpContainer direction="column" justifyContent="space-between">
                    <Card variant="outlined">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Sign up
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleRequestOTP}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    placeholder="Username"
                                    error={usernameError}
                                    helperText={usernameErrorMessage}
                                    color={usernameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    placeholder="your@email.com"
                                    name="email"
                                    autoComplete="email"
                                    variant="outlined"
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    placeholder="••••••"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    error={confirmPasswordError}
                                    helperText={confirmPasswordErrorMessage}
                                    color={confirmPasswordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={validateInputs}
                                disabled={loading}
                                sx={{
                                    // bgcolor: loading ? 'grey.400' : 'primary.main',
                                    // color: loading ? 'white' : 'inherit',
                                    '&.Mui-disabled': {
                                        bgcolor: 'grey.300',
                                        color: 'white',
                                    },
                                }}
                            >
                                {loading ? 'Loading...' : 'Sign up'}
                            </Button>
                        </Box>
                        <Divider>
                            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                        </Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                            />
                            <Typography sx={{ textAlign: 'center' }}>
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </Card>
                </SignUpContainer>
                <Modal open={modalOpen} onClose={() => { }}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2">
                            Enter OTP
                        </Typography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            InputLabelProps={{
                                sx: {
                                    transform: 'translate(10px, 10px)',
                                    '&.Mui-focused, &.MuiFormLabel-filled': {
                                        transform: 'translate(0, -18px)',
                                    },
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirmOTP}
                                disabled={loading}
                                sx={{
                                    // bgcolor: loading ? 'grey.400' : 'inherit',
                                    // color: loading ? 'white' : 'inherit',
                                    '&.Mui-disabled': {
                                        bgcolor: 'grey.300',
                                        color: 'white',
                                    },
                                }}>
                                Confirm
                            </Button>
                        </Box>
                    </Box>
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
            </AppTheme>
        </>
    );
}
