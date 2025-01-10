import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
const Favourite: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const getAccessToken = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        setAccessToken(getAccessToken);
        console.log(accessToken);
    }, [ getAccessToken]);

    const fetchCategoryData = async (type: string) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
                    },
                }
            );
            return response.json();
        } catch (error) {
            console.error(`Error fetching ${type} data:`, error);
            return { total_results: 0, results: [] };
        }
    };

    const fetchAllCategories = async () => {
        const endpoints = ['movie'];
        const results = await Promise.all(endpoints.map(fetchCategoryData));
        const [movieData] = results;
        setMovies(movieData.results);
        setTotalPages(movieData.total_pages);

    };

    useEffect(() => {
        fetchAllCategories();
    }, [page]);


    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="h-[64px]">
            </div>




            {/* Category Results */}
            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 m-5">
                {movies.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        <Link to={`/movie/${item.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                                alt={item.title || item.name}
                                className="w-full object-cover"
                            />
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
                                    <div className="w-10 h-10 mb-2">
                                        <img
                                            src={`https://cdn1.iconfinder.com/data/icons/anchor/128/heart.png`}
                                            className="w-50 h-50 object-contain"
                                        />
                                    </div>
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

export default Favourite;
