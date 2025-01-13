import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
const RatingList: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const getAccessToken = useSelector((state: RootState) => state.auth.accessToken);
    // const [userRate, setUserRating] = useState<number | null>(0);

    useEffect(() => {
        setAccessToken(getAccessToken);
    }, [getAccessToken]);
    const fetchRating = async () => {

        try {
            console.log(accessToken);
            const response = await axios.get(`https://final-nest-back.vercel.app/user/rating/list?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = response.data;
            console.log(data);
            setMovies(data.movies);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(`Error fetchindata:`, error);
            return { total_results: 0, results: [] };
        }
    };
    const submitUserRating = async (rating: number | null, id: number) => {
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

                // setMovie((prevMovie) => ({
                //     ...prevMovie,
                //     vote_average,
                //     vote_count,
                // }));

                fetchRating();
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchRating();
        }
    }, [page, accessToken]);



    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="text-yellow-300 ms-4 font-[Rubik Vinyl] font-bold text-6xl" >
                Rating
            </div>




            {/* Category Results */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 m-5">
                {movies.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out" >
                        <Link to={`/movie/${item.id}`} className="h-[200px]">

                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                                alt={item.title || item.name}
                                className="w-full object-cover"
                            />
                            {/* <object data="" type=""></object> */}

                        </Link>

                        <div className="p-4">
                            <div className="flex justify-between">
                                <div>
                                
                            <h2 className="text-4xl font-bold text-yellow-300">
                                {item.title || item.name}
                            </h2>
                            <h3 className="text-s  flex justify-between text-yellow-500">
                                {item.release_date &&
                                    new Date(item.release_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                }
                            </h3>
                            </div>
                            <div className="text-center ml-4">
                                <p className="text-gray-400 text-sm mt-4">Your rating</p>
                                <p className="text-3xl font-bold text-white">{item.userRating !== null ? item.userRating : '0'}</p>
                            </div>
                            </div>
                            <div className="d-flex items-center mt-4 mb-6">
                                <div className="flex">
                                    <div className="text-center mr-4">
                                        <p className="text-4xl font-bold text-white">{item.vote_average.toFixed(1)}</p>
                                    </div>
                                    <div>

                                        <Rating
                                            name="movie-rating"
                                            value={item.vote_average || 0}
                                            max={10}
                                            precision={0.1}
                                            onChange={(_event, value) => submitUserRating(value, item.id)}
                                            size="large"
                                        />
                                    </div>
                                </div>

                            </div>
                            {item.overview && (
                                <p className="text-sm text-gray-400">
                                    {item.overview.length > 150
                                        ? `${item.overview.substring(0, 150)}...`
                                        : item.overview}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-white">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default RatingList;
