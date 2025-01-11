import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
const WatchList: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const getAccessToken = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        setAccessToken(getAccessToken);
    }, [getAccessToken]);
    const fetchWatchList = async () => {

        try {
            console.log(accessToken);
            const response = await axios.get(`https://final-nest-back.vercel.app/user/watchlist?page=${page}`, {
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


    useEffect(() => {
        if (accessToken) {
            fetchWatchList();
        }
    }, [page, accessToken]);
    const handleDelete = async (id: number) => {
        try {

            if (!accessToken) {
                console.log('Access token not found');
            }
            console.log('Deleting watchlist with token:', accessToken);

            const response = await axios.delete(`https://final-nest-back.vercel.app/user/watchlist/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })

            console.log('Rating submitted successfully:', response);
            setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="text-yellow-300 ms-4 font-[Rubik Vinyl] font-bold text-6xl" >
                Watch list
                
            </div>




            {/* Category Results */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 m-5">
                {movies.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out" >
                        <div className="relative">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                                alt={item.title || item.name}
                                className="w-full object-cover"
                            />
                            <div className="w-20 h-20 absolute top-0 right-0 z-20" onClick={(e) => {e.stopPropagation();handleDelete(item.id);}}>
                                <img
                                    src={`https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-06-512.png`}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <Link to={`/movie/${item.id}`}>

                            <div className="p-4">
                                <h2 className="text-xl font-bold text-yellow-300">
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

                                {item.overview && (
                                    <p className="text-sm text-gray-400">
                                        {item.overview.length > 150
                                            ? `${item.overview.substring(0, 150)}...`
                                            : item.overview}
                                    </p>
                                )}
                            </div>
                        </Link>
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

export default WatchList;
