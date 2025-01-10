import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import 'react-circular-progressbar/dist/styles.css'; // Import CSS của thư viện
import './MovieDetail.css';
import Rating from '@mui/material/Rating';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import axios from 'axios';

const customTheme = createTheme({
    components: {
        MuiRating: {
            styleOverrides: {
                iconEmpty: {
                    color: '#666', // Màu cho các ngôi sao không được đánh giá
                },
            },
        },
    },
});

const MovieDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<any>(null);
    const [credits, setCredits] = useState<any[]>([]); // Mảng diễn viên
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userRating, setUserRating] = useState<number | null>(0);
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const getAccessToken = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated);
        setAccessToken(getAccessToken);
    }, [isAuthenticated, getAccessToken]);

    const handleUserRating = (_event: React.SyntheticEvent, newValue: number | null) => {
        setUserRating(newValue);
        console.log(`User rated: ${newValue}`);
        submitUserRating(newValue);
    };

    const submitUserRating = async (rating: number | null) => {
        try {
            if (!accessToken) {
                console.log('Access token not found');
            }

            // Use accessToken for your API call
            console.log('Submitting rating with token:', accessToken);

            const response =await axios.post(`https://final-nest-back.vercel.app/user/${id}/rate`,{rating},{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })   

            console.log('Rating submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };


    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                // Fetch thông tin chi tiết phim
                const movieResponse = await fetch(`https://final-nest-back.vercel.app/movies/detail/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!movieResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const movieData = await movieResponse.json();
                console.log(movieData);
                setMovie(movieData);

                // Fetch danh sách diễn viên
                const creditsResponse = await fetch(`https://final-nest-back.vercel.app/movies/credits/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!creditsResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const creditsData = await creditsResponse.json();
                // console.log(creditsData);
                setCredits(creditsData[0].cast); // Lưu danh sách diễn viên
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie details or credits:', error);
                setLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!movie) {
        return <div>Movie not found</div>;
    }

    const handleGoToCastDetail = (castId: number) => {
        if (castId) {
            console.log(castId);
            navigate(`/person/${castId}`);
        } else {
            console.error("Invalid cast ID");
        }
    }

    // Tính toán phần trăm từ rating
    // const ratingPercentage = movie.vote_average * 10; // Chuyển đổi từ 0-10 sang 0-100
    const displayedRating = movie.vote_average;

    return (
        <ThemeProvider theme={customTheme}>
            <div className="bg-gray-900 text-white min-h-screen">
                <div className="h-[80px]">
                </div>
                <div className="relative">
                    <div className="container mx-auto p-6 flex flex-col md:flex-row relative z-10">
                        {/* Bên trái: Ảnh poster */}
                        <div className="md:w-1/2 mb-6 md:mb-0  flex justify-center items-center">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                        </div>
                        {/* Bên phải: Nội dung */}
                        <div className="md:w-1/2 md:pl-6">
                            <h1 className="text-4xl font-bold text-yellow-400 mb-3">{movie.title}</h1>
                            <p className="text-lg text-gray-400"><strong>Release Date:</strong> {format(new Date(movie.release_date), 'MMM dd, yyyy')}</p>

                            {/* Hiển thị vòng tròn rating */}
                            {/* <div className="flex items-center mt-4 mb-6">
                            <div className="w-24 h-24 mr-6">
                                <CircularProgressbar
                                    value={ratingPercentage}
                                    text={`${movie.vote_average} / 10`}
                                    strokeWidth={12}
                                    styles={{
                                        path: { stroke: '#f39c12' },
                                        trail: { stroke: '#444' },
                                        text: { fill: '#fff', fontSize: '16px', fontWeight: 'bold' },
                                    }}
                                />
                            </div>
                            <p className="text-xl text-white font-semibold"><strong>Rating:</strong> {movie.vote_average} / 10</p>
                        </div>

                        <Rating
                            name="user-rating"
                            value={userRating}
                            precision={0.1}
                            onChange={handleUserRating}
                            size="large"
                        />
                        <p className="text-gray-300 mt-2">Đánh giá của bạn: {userRating || 0} / 10</p> */}

                            <div className="flex items-center mt-4 mb-6">
                                <div className="text-center mr-4">
                                    <p className="text-4xl font-bold text-white">{displayedRating.toFixed(1)}</p>
                                    <p className="text-gray-400 text-sm">{movie.vote_count} votes</p>
                                </div>
                                <Rating
                                    name="movie-rating"
                                    value={displayedRating}
                                    max={10} // Thang điểm 10 sao
                                    precision={0.1}
                                    readOnly={!isLoggedIn || userRating === null}
                                    onChange={handleUserRating}
                                    size="large"
                                />
                                <div className="text-center mr-4">
                                    <p className="text-gray-400 text-sm">Your rating</p>
                                    <p className="text-4xl font-bold text-white">{userRating}</p>
                                </div>
                            </div>

                            <p className="text-lg text-gray-400"><strong>Genres:</strong> {movie.genres.map((genre: any) => genre.name).join(', ')}</p>

                            <h2 className="text-2xl mt-6 font-bold text-white">Overview</h2>
                            <p className="mt-3 text-lg text-gray-300">{movie.overview}</p>

                            {/* Hiển thị danh sách diễn viên */}
                            <h2 className="text-2xl mt-6 font-bold text-white">Casts</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4">
                                {credits.slice(0, 10).map((actor) => (
                                    <div key={actor.id} className="text-center">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                            alt={actor.name}
                                            className="mx-auto mb-2 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                                            style={{ width: '120px', height: '150px' }}
                                            onClick={() => handleGoToCastDetail(actor.id)}
                                        />
                                        <p className="text-sm text-white">{actor.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default MovieDetail;
