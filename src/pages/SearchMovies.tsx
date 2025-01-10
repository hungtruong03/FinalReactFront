import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
const SearchMovies: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    var { query } = useParams<{ query: string }>();
    var [que, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        minVoteAverage: 0,
        minVoteCount: 0,
        releaseDateFrom: '',
        releaseDateTo: '',
        genres: '',
        sortBy: '',
        sortOrder: 'asc',
        limit: '10',
        page: '1',
    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const fetchCategoryData = async () => {
        try {
            // Tạo query parameters
            const queryParams = new URLSearchParams({
                keyword: query || '',
                page: page.toString(),
                minVoteAverage: formData.minVoteAverage?.toString() || '',
                minVoteCount: formData.minVoteCount?.toString() || '',
                releaseDateFrom: formData.releaseDateFrom || '',
                releaseDateTo: formData.releaseDateTo || '',
                genres: formData.genres || '',
                sortBy: formData.sortBy || '',
                sortOrder: formData.sortOrder || '',
                limit: formData.limit?.toString() || '',
            }).toString();
            alert(`http://localhost:3000/movies/search?${queryParams}`)
            const url = `http://localhost:3000/movies/search?${queryParams}`;
            const response = await axios.get(url)

            

            const data = await response.data;

            // Xử lý dữ liệu nhận được từ API
            setMovies(data.movies || []);
            setTotalPages(data.totalPages || 1); // Chắc chắn totalPages được sử dụng
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };


    useEffect(() => {
        fetchCategoryData();
    }, [query, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (que) {
            setPage(1);
            query = que;
            fetchCategoryData();

        } else {
            console.error("Error");
        }
    }
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="h-[64px]">
            </div>
            <div className="container mx-auto p-6 relative">
                <form onSubmit={handleSearch} className="mb-6">
                    <input
                        type="text"
                        placeholder="Search for a movies"
                        value={que}
                        onChange={(e) => setQuery(e.target.value)}
                        className="p-3 ps-6 md:w-[70%] w-[30%] rounded-l-full text-gray-900 flex-grow focus:outline-none mt-4"
                    />
                    <button
                        type="submit"
                        className="ps-6 pe-6 p-3 bg-gradient-to-r from-pink-500 to-purple-900 hover:opacity-90 text-white rounded-r-full  font-semibold"
                    >
                        Search
                    </button>
                </form>


                <div className="flex items-center space-x-4">
                    <div className="mb-6  w-1/2">

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-3 bg-gradient-to-r from-pink-500 to-purple-900 text-white rounded-full hover:opacity-90 z-50"
                        >
                            <img
                                src="https://img.icons8.com/ios-filled/50/ffffff/filter.png"
                                alt="Filter Icon"
                                className="h-6 w-6"
                            />
                        </button>

                        {/* Menu bộ lọc (Filter Menu) */}
                        {/* Filter Menu */}
                        {showFilters && (
                            <div className="absolute top-50 left-6 bg-gray-800 p-6 rounded-lg shadow-lg w-80 space-y-6">
                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Filter by Vote Average</h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={formData.minVoteAverage}
                                        onChange={handleChange}
                                        name="minVoteAverage"
                                        className="w-full"
                                    />
                                    <span className="text-gray-400">Min Vote: {formData.minVoteAverage}</span>
                                </div>

                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Filter by Vote Count</h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="50"
                                        value={formData.minVoteCount}
                                        onChange={handleChange}
                                        name="minVoteCount"
                                        className="w-full"
                                    />
                                    <span className="text-gray-400">Min Vote Count: {formData.minVoteCount}</span>
                                </div>

                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Release Date From</h3>
                                    <input
                                        type="date"
                                        name="releaseDateFrom"
                                        value={formData.releaseDateFrom}
                                        onChange={handleChange}
                                        className="p-3 rounded-full w-full text-gray-900"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Release Date To</h3>
                                    <input
                                        type="date"
                                        name="releaseDateTo"
                                        value={formData.releaseDateTo}
                                        onChange={handleChange}
                                        className="p-3 rounded-full w-full text-gray-900"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Genres</h3>
                                    <input
                                        type="text"
                                        name="genres"
                                        value={formData.genres}
                                        onChange={handleChange}
                                        placeholder="e.g. Action, Drama"
                                        className="p-3 rounded-full w-full text-gray-900"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Sort By</h3>
                                    <select
                                        name="sortBy"
                                        value={formData.sortBy}
                                        onChange={handleChange}
                                        className="p-3 rounded-full w-full text-gray-900"
                                    >
                                        <option value="vote_average">Vote Average</option>
                                        <option value="release_date">Release Date</option>
                                    </select>
                                </div>


                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-yellow-400 mb-4">Search Results for "{que || query}"</h1>
                </div>



                {/* Category Results */}
                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                        >
                            <Link to={`/movie/${item.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                                    alt={item.title || item.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-yellow-300">
                                        {item.title || item.name}
                                    </h2>
                                    <h3 className="text-s  text-yellow-500">
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

export default SearchMovies;
