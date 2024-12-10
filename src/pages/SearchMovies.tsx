import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SearchMovies: React.FC = () => {
    const [movies, setMovies] = useState<any[]>([]); // Stores movie results
    const [stats, setStats] = useState({ movie: 0, tv: 0, person: 0, collection: 0 }); // Stores category counts
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
    const [selectedCategory, setSelectedCategory] = useState<string>('movie'); // Selected category (default to 'movie')
    var { query } = useParams<{ query: string }>();
    var [que,setQuery] = useState('');
    // Function to fetch data for a single category (e.g., movie, tv, person, collection)
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

    // Function to fetch data for all categories and update the state
    const fetchAllCategories = async () => {
        try {
            const endpoints = ['movie', 'tv', 'person', 'collection'];
            const results = await Promise.all(endpoints.map(fetchCategoryData));
            const [movieData, tvData, personData, collectionData] = results;
            console.log(movieData, tvData, personData, collectionData);

            setStats({
                movie: movieData.total_results,
                tv: tvData.total_results,
                person: personData.total_results,
                collection: collectionData.total_results,
            });

            // Show results for the selected category only
            switch (selectedCategory) {
                case 'movie':
                    setMovies(movieData.results);
                    setTotalPages(movieData.total_pages);
                    break;
                case 'tv':
                    setMovies(tvData.results);
                    setTotalPages(tvData.total_pages);
                    break;
                case 'person':
                    setMovies(personData.results);
                    setTotalPages(personData.total_pages);
                    break;
                case 'collection':
                    setMovies(collectionData.results);
                    setTotalPages(collectionData.total_pages);
                    break;
                default:
                    setMovies(movieData.results);
                    setTotalPages(movieData.total_pages);
                    break;
            }
        } catch (error) {
            console.error('Error fetching data from all categories:', error);
        }
    };

    useEffect(() => {
        fetchAllCategories();
    }, [query, selectedCategory, page]);
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (que) {
            setPage(1); 
            query=que;
            fetchAllCategories();
            
        } else {
            console.error("Error");
        }
    }
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="header bg-gray-900 fixed w-full top-0 z-50">
                <Navbar />
            </div>
            <div className="h-[64px]">
            </div>
            <div className="container mx-auto p-6 relative">
                    <form onSubmit={handleSearch} className="w-full mb-6">
                        <input
                            type="text"
                            placeholder="Search for a movies"
                            value={que}
                            onChange={(e) => setQuery(e.target.value)}
                            className="p-3 ps-6 w-[80%] rounded-l-full text-gray-900 flex-grow focus:outline-none mt-4"
                        />
                        <button
                            type="submit"
                            className="ps-6 pe-6 p-3 bg-gradient-to-r from-pink-500 to-purple-900 hover:opacity-90 text-white rounded-r-full  font-semibold"
                        >
                            Search
                        </button>
                    </form>
                <h1 className="text-2xl font-bold text-yellow-400 mb-4">Search Results for "{que||query}"</h1>
                <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-6">
                    {/* Category Statistics Table */}
                    <div className="md:col-span-3 overflow-x-auto mb-8">
                        <table className="table-auto w-full text-left text-gray-300 bg-gray-800 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-gray-700 text-yellow-400">
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Total Results</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    onClick={() => setSelectedCategory('movie')}
                                    className={`cursor-pointer ${selectedCategory === 'movie' ? 'bg-gray-700' : ''}`}
                                >
                                    <td className="border-t border-gray-700 px-4 py-2">Movies</td>
                                    <td className="border-t border-gray-700 px-4 py-2">{stats.movie}</td>
                                </tr>
                                <tr
                                    onClick={() => setSelectedCategory('tv')}
                                    className={`cursor-pointer ${selectedCategory === 'tv' ? 'bg-gray-700' : ''}`}
                                >
                                    <td className="border-t border-gray-700 px-4 py-2">TV Shows</td>
                                    <td className="border-t border-gray-700 px-4 py-2">{stats.tv}</td>
                                </tr>
                                <tr
                                    onClick={() => setSelectedCategory('person')}
                                    className={`cursor-pointer ${selectedCategory === 'person' ? 'bg-gray-700' : ''}`}
                                >
                                    <td className="border-t border-gray-700 px-4 py-2">People</td>
                                    <td className="border-t border-gray-700 px-4 py-2">{stats.person}</td>
                                </tr>
                                <tr
                                    onClick={() => setSelectedCategory('collection')}
                                    className={`cursor-pointer ${selectedCategory === 'collection' ? 'bg-gray-700' : ''}`}
                                >
                                    <td className="border-t border-gray-700 px-4 py-2">Collections</td>
                                    <td className="border-t border-gray-700 px-4 py-2">{stats.collection}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Category Results */}
                    <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {movies.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                <Link to={`/${selectedCategory}/${item.id}`}>
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
                                            {new Date(item.release_date).getFullYear()||item.popularity }
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
        </div>
    );
};

export default SearchMovies;
