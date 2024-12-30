import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement('#root');

const Home: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message;
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<any[]>([]);
    const [trailers, setTrailers] = useState<any[]>([]);
    const [popularMovies, setPopularMovies] = useState<any[]>([]);
    const [selectedTrailer, setSelectedTrailer] = useState<any | null>(null);
    const [hoveredTrailer, setHoveredTrailer] = useState('');
    const [timeframe, setTimeframe] = useState<"day" | "week">("day");

    const TMDB_API_KEY = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

    const fetchMovies = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/${timeframe}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TMDB_API_KEY}`,
                },
            }
        );
        const data = await response.json();
        setMovies(data.results);
    };

    const fetchPopularMovies = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TMDB_API_KEY}`,
                },
            }
        );
        const data = await response.json();
        setPopularMovies(data.results);
    };

    const fetchLatestTrailers = async () => {
        try {
            const discoverResponse = await fetch(
                `https://api.themoviedb.org/3/movie/upcoming`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${TMDB_API_KEY}`,
                    },
                }
            );
    
            const discoverData = await discoverResponse.json();
            const latestMovies = discoverData.results.slice(0, 4);
    
            const trailerPromises = latestMovies.map(async (movie: any) => {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${TMDB_API_KEY}`,
                        },
                    }
                );
    
                const data = await response.json();
                const trailer = data.results.find((vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube');
                return trailer ? { ...trailer, movie } : null;
            });
    
            const resolvedTrailers = (await Promise.all(trailerPromises)).filter(Boolean);
            setTrailers(resolvedTrailers);
            setHoveredTrailer(resolvedTrailers[0]?.movie.backdrop_path);
        } catch (error) {
            console.error('Error fetching trailers:', error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [timeframe]);

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            fetchLatestTrailers();
        }
    }, [movies]);

    const handleSwitch = (option: "day" | "week") => {
        setTimeframe(option);
    };

    const handleGoToDetail = (id: number) => {
        if (id) {
            console.log(id);
            navigate(`/movie/${id}`); // Điều hướng đến trang chi tiết phim
        } else {
            console.error("Invalid movie ID");
        }
    }
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            console.log(query);
            navigate(`/search/${query}`);
        } else {
            console.error("Error");
        }
    }

    const openModal = (trailer: any) => {
        setSelectedTrailer(trailer);
    };

    const closeModal = () => {
        setSelectedTrailer(null);
    };

    return (
        <div className="">
            <div className="w-[64px]">
            </div>
            <div className="pt-4 flex-grow flex items-center justify-center bg-[url('https://i.pinimg.com/originals/07/21/1b/07211b078ab5e9f537a3daeccef72279.jpg')] bg-cover bg-center bg-no-repeat min-h-80 flex flex-col text-white">
                <div className="text-center w-full">
                    <h1 className="text-4xl font-bold mb-6">Welcome to the Homepage</h1>
                    {message && (
                        <p className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg inline-block">
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleSearch} className="w-full mb-6">
                        <input
                            type="text"
                            placeholder="Search for a movies"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="p-3 ps-6 w-[50%] rounded-l-full text-gray-900 flex-grow focus:outline-none mt-4"
                        />
                        <button
                            type="submit"
                            className="ps-6 pe-6 p-3 bg-gradient-to-r from-pink-500 to-purple-900 hover:opacity-90 text-white rounded-r-full  font-semibold"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-black mb-4 mt-4">Trending</h2>
                    <div className="relative flex bg-gray-800 p-2 rounded-full w-80 ml-4">
                        <div
                            className={`absolute h-3/5 bg-gray-700 rounded-full transition-all ${timeframe === "day" ? "w-1/2 left-0 ml-2" : "w-1/2 left-1/2 -ml-2"}`}
                        />
                        <button
                            className={`relative z-5 flex-1 text-white ${timeframe === "day" ? "font-bold" : ""}`}
                            onClick={() => handleSwitch("day")}
                        >
                            Today
                        </button>
                        <button
                            className={`relative z-5 flex-1 text-white ${timeframe === "week" ? "font-bold" : ""}`}
                            onClick={() => handleSwitch("week")}
                        >
                            This Week
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="flex gap-4">
                        {movies.map((movie) => {
                            // const votePercentage = movie.vote_count === 0 ? "NR" : Math.round(movie.vote_average * 10);
                            const ratingPercentage = Math.round(movie.vote_average * 10);

                            const getColor = () => {
                                if (movie.vote_count === 0) return '#6c757d'; // Gray
                                if (ratingPercentage > 70) return '#27ae60'; // Green
                                if (ratingPercentage >= 50) return '#f1c40f'; // Yellow
                                return '#e74c3c'; // Red
                            };

                            return (
                                <div key={movie.id} className="w-[200px] bg-gray-800 text-white p-4 rounded-lg flex-shrink-0 relative cursor-pointer" onClick={() => handleGoToDetail(movie.id)}>
                                    <div className="relative">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="rounded-md w-[1800px] h-[200px] object-cover mb-4 mx-auto"
                                        />
                                        {/* <div className={`absolute -top-3 -left-3 text-xs rounded-full w-10 h-10 flex items-center justify-center border-4 border-gray-600 bg-gray-900 ${getColor()}`}>
                                            {votePercentage}{votePercentage === "NR" ? "" : "%"}
                                        </div> */}
                                        <div className="absolute -top-2 -left-2 w-10 h-10 bg-[#2d2d2d] rounded-full">
                                            <CircularProgressbar
                                                value={movie.vote_count === 0 ? 0 : ratingPercentage}
                                                text={movie.vote_count === 0 ? "NR" : `${ratingPercentage.toString()}%`}
                                                strokeWidth={12}
                                                styles={buildStyles({
                                                    pathColor: getColor(),
                                                    backgroundColor: "#2d2d2d",
                                                    trailColor: '#444',
                                                    textColor: '#fff',
                                                    textSize: '32px',
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <h3 className="font-bold text-center text-sm break-words line-clamp-2" title={movie.title}>
                                            {movie.title}
                                        </h3>
                                        <p className="text-xs italic text-center">
                                            {format(new Date(movie.release_date), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="p-4 mt-4"
                    style={{
                        backgroundImage: `url(https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${hoveredTrailer})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backdropFilter: 'blur(0px)',
                    }}
                >
                    <h2 className="text-2xl font-bold text-white mb-4 mt-4">Latest Trailers</h2>
                    <div className="flex gap-4 overflow-x-auto">
                        {trailers.map((trailer) => (
                            <div
                                key={trailer.id}
                                className="w-[350px] text-white p-4 rounded-lg flex-shrink-0 relative cursor-pointer"
                                onMouseEnter={() => setHoveredTrailer(trailer.movie.backdrop_path)}
                            >
                                <div className="relative" onClick={() => openModal(trailer)}>
                                    <img
                                        src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                                        alt={trailer.name}
                                        className="w-full h-[300px] rounded-md"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                        <FontAwesomeIcon className='w-10 h-10' icon={faPlay} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-center text-sm mt-2" onClick={() => handleGoToDetail(trailer.movie.id)}>{trailer.movie.title}</h3>
                                <h4 className="font-semibold text-white text-center text-sm mt-2">{format(new Date(trailer.movie.release_date), 'MMM dd, yyyy')}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal */}
                {selectedTrailer && (
                    <Modal
                        isOpen={!!selectedTrailer}
                        onRequestClose={closeModal}
                        className="bg-gray-900 p-4 max-w-6xl mx-auto my-20 rounded-lg"
                        overlayClassName="bg-black bg-opacity-75 fixed inset-0 flex items-center justify-center"
                    >
                        <div>
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
                                title={selectedTrailer.name}
                                className="w-[800px] h-[500px] rounded-md"
                                allowFullScreen
                            />
                            <h3 className="font-bold text-center text-xl mt-4 text-white">
                                {selectedTrailer.movie.title}
                            </h3>
                        </div>
                    </Modal>
                )}

                <div className="flex items-center mb-4 mt-4">
                    <h2 className="text-2xl font-bold text-black mb-4 mt-4">What's Popular</h2>
                </div>
                <div className="overflow-x-auto">
                    <div className="flex gap-4">
                        {popularMovies.map((movie) => {
                            // const votePercentage = movie.vote_count === 0 ? "NR" : Math.round(movie.vote_average * 10);
                            const ratingPercentage = Math.round(movie.vote_average * 10);

                            const getColor = () => {
                                if (movie.vote_count === 0) return '#6c757d'; // Gray
                                if (ratingPercentage > 70) return '#27ae60'; // Green
                                if (ratingPercentage >= 50) return '#f1c40f'; // Yellow
                                return '#e74c3c'; // Red
                            };

                            return (
                                <div key={movie.id} className="w-[200px] bg-gray-800 text-white p-4 rounded-lg flex-shrink-0 relative cursor-pointer" onClick={() => handleGoToDetail(movie.id)}>
                                    <div className="relative">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="rounded-md w-[1800px] h-[200px] object-cover mb-4 mx-auto"
                                        />
                                        {/* <div className={`absolute -top-3 -left-3 text-xs rounded-full w-10 h-10 flex items-center justify-center border-4 border-gray-600 bg-gray-900 ${getColor()}`}>
                                            {votePercentage}{votePercentage === "NR" ? "" : "%"}
                                        </div> */}
                                        <div className="absolute -top-2 -left-2 w-10 h-10 bg-[#2d2d2d] rounded-full">
                                            <CircularProgressbar
                                                value={movie.vote_count === 0 ? 0 : ratingPercentage}
                                                text={movie.vote_count === 0 ? "NR" : `${ratingPercentage.toString()}%`}
                                                strokeWidth={12}
                                                styles={buildStyles({
                                                    pathColor: getColor(),
                                                    backgroundColor: "#2d2d2d",
                                                    trailColor: '#444',
                                                    textColor: '#fff',
                                                    textSize: '32px',
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <h3 className="font-bold text-center text-sm break-words line-clamp-2" title={movie.title}>
                                            {movie.title}
                                        </h3>
                                        <p className="text-xs italic text-center">
                                            {format(new Date(movie.release_date), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;