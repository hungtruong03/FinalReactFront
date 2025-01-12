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
import CircularProgress from '@mui/material/CircularProgress';
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
    const [movie, setMovie] = useState({
        vote_average: 0,
        vote_count: 0,
        poster_path: '',
        title: '',
        release_date: '',
        genres: [],
        overview: '',
    });
    
    const [credits, setCredits] = useState<any[]>([]); // Mảng diễn viên
    const [reviews, setReviews] = useState<any[]>([]); // Reviews data
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userRating, setUserRating] = useState<number | null>(0);
    const [expandedReviewIds, setExpandedReviewIds] = useState<string[]>([]);
    const [highlightCasts, setHighlightCasts] = useState(false);
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const getAccessToken = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated);
        setAccessToken(getAccessToken);
    }, [isAuthenticated, getAccessToken]);

    useEffect(() => {
        if (accessToken) {
            fetchUserRating();
        }
    }, [accessToken]);

    const toggleReviewExpansion = (id: string) => {
        setExpandedReviewIds((prevIds) =>
            prevIds.includes(id)
                ? prevIds.filter((reviewId) => reviewId !== id) // Ẩn review
                : [...prevIds, id] // Hiển thị đầy đủ review
        );
    };

    const fetchUserRating = async () => {
        try {
            const response = await axios.get(
                `https://final-nest-back.vercel.app/user/rate/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("Diem", response.data);

            if (response.data) {
                setUserRating(response.data); // Lưu điểm đánh giá của user
            } else {
                setUserRating(null); // Nếu chưa đánh giá
            }
        } catch (error) {
            console.error('Error fetching user rating:', error);
        }
    };

    const submitUserRating = async (rating: number | null) => {
        try {
            if (!accessToken) {
                console.log('Access token not found');
                return;
            }
    
            const response = await axios.post(
                `https://final-nest-back.vercel.app/user/rate/${id}`,
                { rating },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
    
            if (response.data) {
                const { vote_average, vote_count } = response.data;

                console.log(vote_average, vote_count);
    
                // Cập nhật thông tin phim
                setMovie((prevMovie) => ({
                    ...prevMovie,
                    vote_average,
                    vote_count,
                }));
    
                // Cập nhật điểm đánh giá của user
                setUserRating(rating);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };
    

    // const handleAddToWatchlist = async () => {
    //     try {
    //         if (!accessToken) {
    //             console.log('Access token not found');
    //             return;
    //         }

    //         const response = await axios.post(`https://final-nest-back.vercel.app/user/watchlist/${id}`, {}, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${accessToken}`
    //             }
    //         });

    //         console.log('Movie added to watchlist:', response);
    //     } catch (error) {
    //         console.error('Error adding movie to watchlist:', error);
    //     }
    // };

    const handleAddToFavorites = async () => {
        try {

            if (!accessToken) {
                console.log('Access token not found');
            }
            console.log('Submitting favourite with token:', accessToken);

            const response = await axios.post(`https://final-nest-back.vercel.app/user/favourite/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })

            console.log('favourite submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting favourite:', error);
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
                setCredits(creditsData[0].cast); // Lưu danh sách diễn viên

                // Fetch reviews
                const reviewsResponse = await fetch(`https://final-nest-back.vercel.app/movies/reviews/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!reviewsResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const reviewsData = await reviewsResponse.json();
                console.log(reviewsData);
                setReviews(reviewsData); // Lưu danh sách reviews

                setLoading(false);

                setTimeout(() => {
                    const hash = window.location.hash;
                    if (hash === '#casts') {
                        const element = document.getElementById('casts');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });

                            setHighlightCasts(true);
                            setTimeout(() => setHighlightCasts(false), 2000); // Remove highlight after 2 seconds
                        }
                    }
                }, 500);
            } catch (error) {
                console.error('Error fetching movie details or credits:', error);
                setLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id]);

    if (loading) {
        return <div className='bg-gray-900 text-white flex justify-center'><CircularProgress className='mt-72 mb-72' /></div>;
    }

    if (!movie) {
        return <div className='text-2xl mt-6 font-bold text-black text-center'>Movie not found</div>;
    }

    const handleGoToCastDetail = (castId: number) => {
        if (castId) {
            console.log(castId);
            navigate(`/person/${castId}`);
        } else {
            console.error("Invalid cast ID");
        }
    }
    const handleWatchList = async () => {
        try {

            if (!accessToken) {
                console.log('Access token not found');
            }
            console.log('Submitting watchlist with token:', accessToken);

            const response = await axios.post(`https://final-nest-back.vercel.app/user/watchlist/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })

            console.log('Rating submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const WatchlistIcon = () => (
        <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-1 14h2v-6h-2v6z" />
        </svg>
    );

    const FavoritesIcon = () => (

        <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    return (
        <ThemeProvider theme={customTheme}>
            <div className="bg-gray-900 text-white min-h-screen">
                {/* <div className="h-[80px]">
                    <button onClick={handleWatchList}>
                        Watch List
                    </button>
                </div> */}
                <div className="relative">
                    <div className="container mx-auto p-6 flex flex-col md:flex-row relative z-10">
                        {/* Bên trái: Ảnh poster */}
                        <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center items-start">
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

                            <div className="flex items-center mt-4 mb-6">
                                <div className="text-center mr-4">
                                    <p className="text-4xl font-bold text-white">{movie.vote_average.toFixed(1)}</p>
                                    <p className="text-gray-400 text-sm">{movie.vote_count} votes</p>
                                </div>
                                <Rating
                                    name="movie-rating"
                                    value={movie.vote_average || 0}
                                    max={10}
                                    precision={0.1}
                                    onChange={(_event, value) => submitUserRating(value)}
                                    size="large"
                                />
                                <div className="text-center ml-4">
                                    <p className="text-gray-400 text-sm">Your rating</p>
                                    <p className="text-4xl font-bold text-white">{userRating !== null ? userRating : '0'}</p>
                                </div>
                            </div>


                            <div className="flex space-x-4 mt-4">
                                {isLoggedIn && (
                                    <>
                                        <button
                                            onClick={handleWatchList}
                                            className="icon-button"
                                            aria-label="Add to Watchlist"
                                        >
                                            <WatchlistIcon />
                                        </button>
                                        <button
                                            onClick={handleAddToFavorites}
                                            className="icon-button"
                                            aria-label="Add to Favorites"
                                        >
                                            <FavoritesIcon />
                                        </button>
                                    </>
                                )}
                            </div>


                            <p className="text-lg text-gray-400 mt-4"><strong>Genres:</strong> {movie.genres.map((genre: any) => genre.name).join(', ')}</p>

                            <h2 className="text-2xl mt-6 font-bold text-white">Overview</h2>
                            <p className="mt-3 text-lg text-gray-300">{movie.overview}</p>

                            <h2 id="casts" className="text-2xl mt-6 font-bold text-white">Casts</h2>
                            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4 ${highlightCasts ? 'border-4 border-yellow-400' : ''}`}>
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

                            <h2 className="text-2xl mt-6 font-bold text-white">Reviews</h2>
                            <div className="mt-4 space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => {
                                        const isExpanded = expandedReviewIds.includes(review.id);
                                        const contentToShow = isExpanded
                                            ? review.content // Hiển thị đầy đủ nếu mở rộng
                                            : review.content.length > 300
                                            ? `${review.content.slice(0, 150)}...` // Cắt ngắn nếu quá dài
                                            : review.content;

                                        return (
                                            <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                                <div className="flex items-center mb-2">
                                                    {review.author_details.avatar_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w64_and_h64_face${review.author_details.avatar_path}`}
                                                            alt={`${review.author}'s avatar`}
                                                            className="w-10 h-10 rounded-full mr-4"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                                                            <span className="text-white text-sm">NA</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-yellow-400">
                                                            {review.author || "Anonymous"}
                                                        </h3>
                                                        {review.author_details.rating !== null && (
                                                            <p className="text-sm text-gray-400">
                                                                Rating: {review.author_details.rating}/10
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300">{contentToShow}</p>
                                                {review.content.length > 300 && (
                                                    <button
                                                        className="text-yellow-400 mt-2"
                                                        onClick={() => toggleReviewExpansion(review.id)}
                                                    >
                                                        {isExpanded ? "Show Less" : "Show More"}
                                                    </button>
                                                )}
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {new Date(review.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="bg-gray-800 p-6 rounded-lg text-center">
                                        <p className="text-gray-400">No reviews available for this movie.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default MovieDetail;
