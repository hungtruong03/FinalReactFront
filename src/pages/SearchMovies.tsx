import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
const SearchMovies: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    var { query } = useParams<{ query: string }>();
    var [que, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [sort, setSort] = useState<string>('popularity.desc');  // Filter by vote average
    const [releaseYear, setReleaseYear] = useState<string[]>([]);
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const year = e.target.value;
        setReleaseYear(prevState =>
            e.target.checked ? [...prevState, year] : prevState.filter((y) => y !== year)
        );
    };
    const fetchCategoryData = async (type: string) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/${type}?query=${query}&page=${page}`,
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
    }, [query, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (que) {
            setPage(1);
            query = que;
            fetchAllCategories();

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
                        {showFilters && (
                            <div className="absolute top-50 left-6 bg-gray-800 p-6 rounded-lg shadow-lg w-80 space-y-6">
                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Filter by Release Year</h3>
                                    <div className="flex flex-wrap">
                                        {[1990, 2000, 2010, 2020].map((year) => (
                                            <div key={year} className="flex items-center mr-4 mb-2">
                                                <input
                                                    type="checkbox"
                                                    value={year.toString()}
                                                    onChange={handleYearChange}
                                                    id={`year-${year}`}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`year-${year}`} className="text-gray-400">
                                                    {year}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>



                                <div>
                                    <h3 className="text-lg text-yellow-400 mb-2">Sort By</h3>
                                    <select
                                        id="sort"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="p-3 rounded-full text-gray-900 w-full"
                                    >
                                        <option value="popularity.desc">Popularity</option>
                                        <option value="vote_average.desc">Vote Average</option>
                                        <option value="release_date.desc">Release Date</option>
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
