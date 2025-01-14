import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const pages = [
    { name: 'Log in', path: '/login' },
    { name: 'Register', path: '/register' },
];

function ResponsiveAppBar() {
    const [navSearchQuery, setNavSearchQuery] = React.useState('');
    const [navLoading, setNavLoading] = React.useState(false);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'error' | 'info' | 'success' | 'warning' }>({ open: false, message: '', severity: 'info' });
    const { open, message, severity } = snackbar;

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handlePageNavigation = (path: string) => {
        handleCloseNavMenu();
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('authData');
        sessionStorage.removeItem('authData');
        dispatch(logout());
        navigate('/login');
    };

    const handleSubmitNavigationSearch = async () => {
        if (!navSearchQuery.trim()) {
            setSnackbar({
                open: true,
                message: 'Please enter the query.',
                severity: 'error',
            });
            return;
        }

        setNavLoading(true);

        try {
            const response = await axios.post('https://final-nest-back.vercel.app/aiapi/navigate/', { query: navSearchQuery });

            const { route, params } = response.data;

            switch (route) {
                case 'HOME_PAGE':
                    navigate('/');
                    break;

                case 'PROFILE_PAGE':
                    if (isAuthenticated) {
                        navigate('/profile');
                    } else {
                        setSnackbar({
                            open: true,
                            message: 'You need to log in to access the profile page.',
                            severity: 'error',
                        });
                    }
                    break;

                case 'SEARCH_PAGE':
                    if (params?.keyword) {
                        navigate(`/search/${params.keyword}`);
                    }
                    break;

                case 'CAST_PAGE':
                case 'MOVIE_PAGE':
                    if (params?.movie_ids) {
                        const movieId = params.movie_ids;
                        navigate(`/movie/${movieId}${route === 'CAST_PAGE' ? '#casts' : ''}`);
                    }
                    break;

                case 'GENRE_PAGE':
                case 'NONE':
                default:
                    setSnackbar({
                        open: true,
                        message: 'No matching route found.',
                        severity: 'error',
                    });
                    break;
            }

            setNavLoading(false);
        } catch (error) {
            console.error('Error fetching navigation destination:', error);
            setSnackbar({
                open: true,
                message: 'Failed to navigate, please try again later.',
                severity: 'error',
            });
            setNavLoading
        } finally {
            setNavLoading(false);
        }
    };


    return (
        <AppBar position="static" sx={{ backgroundColor: '#000044' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Home
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        {!isAuthenticated && (
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    {pages.map(({ name, path }) => (
                                        <MenuItem key={name} onClick={() => handlePageNavigation(path)}>
                                            <Typography sx={{ textAlign: 'center' }}>{name}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Home
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {!isAuthenticated &&
                            pages.map(({ name, path }) => (
                                <Button
                                    key={name}
                                    onClick={() => handlePageNavigation(path)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {name}
                                </Button>
                            ))}
                    </Box>
                    <Box component="form" onSubmit={() => { }}>
                        <FormControl fullWidth>
                            <TextField
                                required
                                fullWidth
                                id="navi-search"
                                name="navi-search"
                                variant="outlined"
                                placeholder="Navigate to..."
                                value={navSearchQuery}
                                onChange={(e) => setNavSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            /
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSubmitNavigationSearch}
                                                sx={{
                                                    backgroundColor: '#ec4899',
                                                    color: '#fff',
                                                    textTransform: 'none',
                                                    padding: '2px 8px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    '&:hover': {
                                                        backgroundColor: '#be185d',
                                                    },
                                                }}
                                            >
                                                {navLoading ? <CircularProgress size={16} /> : 'Go'}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    background: 'linear-gradient(to right, #ec4899, #6b21a8)',
                                    borderRadius: '6px',
                                    padding: '2px',
                                    '& .MuiOutlinedInput-root': {
                                        height: '36px',
                                        fontSize: '0.8rem',
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>
                    {isAuthenticated ? (
                        <Box sx={{ flexGrow: 0, ml: '20px' }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={() => navigate('/profile')}>
                                    <Typography textAlign="center">Profile</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/favourite')}>
                                    <Typography textAlign="center">Favourite</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/rating')}>
                                    <Typography textAlign="center">Rating </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/watchlist')}>
                                    <Typography textAlign="center">Watch List</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : null}
                </Toolbar>
            </Container>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </AppBar >
    );
}
export default ResponsiveAppBar;